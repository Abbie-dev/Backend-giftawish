import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
dotenv.config();
//create a cache for storing verification codes
const otpCache = new NodeCache({ stdTTL: 300 });

// Create a Nodemailer transporter with SMTP server configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 465, // Forces the port to be read as a number
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD, 
  },
  tls: {
    // This allows the secure SSL connection to establish without being blocked by Render
    rejectUnauthorized: false 
  }
});
export const sendVerificationEmail = async (email) => {
  //generate  a random four digit code

  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  //store the verification code in the cache

  otpCache.set(email, verificationCode);
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Please verify your email',
    html: `<p> Your verification code is: <strong>${verificationCode}</strong></p>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
    return verificationCode;
  } catch (error) {
    console.log('Error sending verification email:', error);
  }
};

// Helper function to send success email
export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(' email sent:', info.response);
  } catch (error) {
    console.log('Error sending  email:', error);
  }
};
//export otpCache
export { otpCache };