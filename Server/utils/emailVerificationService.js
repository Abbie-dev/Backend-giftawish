import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
dotenv.config();

// Initialize SendGrid
sgMail.setApiKey(process.env.PASSWORD);

//create a cache for storing verification codes
const otpCache = new NodeCache({ stdTTL: 300 });

// Professional HTML email template for OTP
const buildVerificationEmailHtml = (code) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your GiftAWish account</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#dd6421;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:1px;">GiftAWish</h1>
              <p style="margin:6px 0 0;color:#ffe0cc;font-size:14px;">Making gifting magical ✨</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#222222;font-size:22px;">Verify your email address</h2>
              <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
                Thanks for signing up! Use the verification code below to confirm your email address and activate your GiftAWish account.
              </p>
              <!-- Code box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:24px 0;">
                    <div style="display:inline-block;background-color:#fff4ef;border:2px dashed #dd6421;border-radius:8px;padding:20px 48px;">
                      <span style="font-size:42px;font-weight:bold;letter-spacing:12px;color:#dd6421;">${code}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#555555;font-size:14px;line-height:1.6;">
                This code expires in <strong>5 minutes</strong>. If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} GiftAWish. All rights reserved.<br/>
                You're receiving this email because you signed up at giftawish.vercel.app
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Professional HTML email template for general notifications
const buildGeneralEmailHtml = (message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GiftAWish Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="background-color:#dd6421;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:1px;">GiftAWish</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;color:#555555;font-size:15px;line-height:1.7;">
              ${message}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#999999;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} GiftAWish. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendVerificationEmail = async (email) => {
  //generate a random four digit code
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  //store the verification code in the cache
  otpCache.set(email, verificationCode);

  const mailOptions = {
    from: {
      name: 'GiftAWish',
      email: process.env.EMAIL,
    },
    to: email,
    subject: 'Your GiftAWish verification code',
    html: buildVerificationEmailHtml(verificationCode),
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
    from: {
      name: 'GiftAWish',
      email: process.env.EMAIL,
    },
    to: options.email,
    subject: options.subject,
    html: buildGeneralEmailHtml(options.message),
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