import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js';
import asynchandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  sendVerificationEmail,
  sendEmail,
  otpCache,
} from '../utils/emailVerificationService.js';
import createToken from '../utils/createToken.js';

import dotenv from 'dotenv';
dotenv.config();

//register user
const registerUser = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      });
      const user = await newUser.save();
      // Send verification email
      const verificationCode = await sendVerificationEmail(email);

      return res.status(201).json({
        user,
        message:
          'User registered successfully. Please enter the verification code sent to your email.',
        verificationCode,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//register vendor
const registervendor = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({
        message: 'User already exists',
      });
    } else {
      const newVendor = new Vendor(req.body);
      const vendor = await newVendor.save();
      // Send verification email
      const verificationCode = await sendVerificationEmail(email);
      return res.status(201).json({
        vendor,
        verificationCode,
        message:
          'Vendor registered successfully. Please check your email to verify your account.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//verify email address
const verifyEmail = asynchandler(async (req, res) => {
  try {
    const { email, code } = req.body;
    //find the user or vendor by email

    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });
    if (!user && !vendor) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    //determine the person(user or vendor) based on the found document

    const person = user || vendor;
    // check if the user or vendor is already verified
    if (person.emailIsVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    //check if the verification code is correct
    const storedVerificationCode = otpCache.get(email);

    if (!storedVerificationCode || code !== storedVerificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    //update the user's emailIsVerified field

    person.emailIsVerified = true;
    await person.save();

    // send a success email
    const message = `<p>Your account has been verified. Please log in</p>`;
    await sendEmail({
      email: email,
      subject: 'Your account has been verified',
      message,
    });
    return res.status(200).json({ message: 'Email verified!', person });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//resend verification code

const resendVerificationCode = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user or vendor by email
    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });

    if (!user && !vendor) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    //resend the verification code
    const verificationCode = await sendVerificationEmail(email);

    otpCache.set(email, verificationCode);
    return res.status(201).json({
      verificationCode,
      message: ' Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// login
const login = asynchandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });
    if (!user && !vendor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    let passwordMatch;
    let userOrVendor;

    if (user) {
      passwordMatch = await user.isPasswordMatched(password);
      userOrVendor = user;
    } else if (vendor) {
      passwordMatch = await vendor.isPasswordMatched(password);
      userOrVendor = vendor;
    }

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    //generate token
    const token = createToken(userOrVendor._id);

    //store in cookies
    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    //delete password from response
    delete userOrVendor._doc.password;
    res.status(200).json(userOrVendor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//signin with google account
const signInWithGoogle = asynchandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const vendor = await vendor.findOne({ email: req.body.email });
    if (user || vendor) {
      const userOrVendor = user || vendor;
      //generate token
      const token = createToken(userOrVendor._id);

      //store in cookies
      res.cookie('accessToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      //delete password from response
      delete userOrVendor._doc.password;
      res.status(200).json(userOrVendor);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedpassword = await bcrypt.hash(generatedPassword, 10);

      // Generate first name and last name based on the email address
      const emailParts = req.body.email.split('@');
      const emailAlias = emailParts[0];
      const generatedFirstName =
        emailAlias.charAt(0).toUpperCase() + emailAlias.slice(1);
      const generatedLastName = Math.random().toString(36).slice(-4);

      // Create new user
      const newUser = new User({
        firstName: generatedFirstName,
        lastName: generatedLastName,
        email: req.body.email,
        password: hashedpassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('accessToken', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ rest, message: 'You are Logged in' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//forgot password
const forgotPassword = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'user does not exist' });
    } else {
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const resetPasswordLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
      //send email to reset password
      const message = `<p>Click <a href="${resetPasswordLink}">here</a> reset your password.</p>`;
      await sendEmail({
        email: email,
        subject: 'Reset Your Password',
        message,
      });
      return res.status(200).json('success');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//reset password
const resetPassword = asynchandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log(decoded);
    const hashedpassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(userId, {
      password: hashedpassword,
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset code' });
    } else {
      await user.save();
      //send success email
      const email = user.email;
      const message = `<p>Your password has been reset. Please log in</p>`;
      await sendEmail({
        email: email,
        subject: 'Your password has been reset',
        message,
      });
      return res.status(200).json('Password reset successfully');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//forgot password vendor
const forgotPasswordVendor = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: 'Vendor does not exist' });
    } else {
      const resetToken = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const resetPasswordLink = `http://localhost:5000/api/auth/reset-password-vendor/${resetToken}`;
      const message = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`;
      await sendEmail({
        email: email,
        subject: 'Reset Your Password',
        message,
      });
      return res.status(200).json('success');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//reset password vendor
const resetPasswordVendor = asynchandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendorId = decoded.id;
    const hashedpassword = await bcrypt.hash(password, 12);
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { password: hashedpassword } // Update the password field
    );

    if (!vendor) {
      return res.status(400).json({ message: 'Invalid reset code' });
    } else {
      await vendor.save();
      //send sucess email
      const email = vendor.email;
      const message = `<p>Your password has been reset. Please log in</p>`;
      await sendEmail({
        email: email,
        subject: 'Your password has been reset',
        message,
      });

      return res.status(200).json('Password reset successfully');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
//logout
const logout = asynchandler(async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.status(200).json('You have logged out');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  registerUser,
  registervendor,
  verifyEmail,
  resendVerificationCode,
  login,
  signInWithGoogle,
  forgotPassword,
  resetPassword,
  forgotPasswordVendor,
  resetPasswordVendor,
  logout,
};
