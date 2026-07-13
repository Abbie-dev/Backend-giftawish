import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
dotenv.config();

// Initialize SendGrid
sgMail.setApiKey(process.env.PASSWORD);

//create a cache for storing verification codes
const otpCache = new NodeCache({ stdTTL: 300 });

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

  // Send the email in the background to prevent request blocking
  sgMail.send(mailOptions)
    .then((info) => {
      console.log('Verification email sent:', info[0].statusCode);
    })
    .catch((error) => {
      console.error('Error sending verification email asynchronously:', error);
    });

  return verificationCode;
};

// Helper function to send success email
export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send the email in the background
  sgMail.send(mailOptions)
    .then((info) => {
      console.log('Email sent:', info[0].statusCode);
    })
    .catch((error) => {
      console.error('Error sending email asynchronously:', error);
    });
};
//export otpCache
export { otpCache };