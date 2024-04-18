import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
//create a cache for storing verification codes
const otpCache = new Map();

// Create a Nodemailer transporter with SMTP server configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, // SMTP server port
  secure: true, // Use SSL/TLS (true for 465, false for other ports)
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password or app-specific password
  },
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