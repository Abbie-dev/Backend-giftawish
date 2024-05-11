import express from 'express';

import {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  login,
  adminLogin,
  signInWithGoogle,
  forgotPassword,
  resetPassword,
  registervendor,
  forgotPasswordVendor,
  resetPasswordVendor,
  logout,
} from '../controllers/authCtrl.js';
import isVerifiedAccount from '../middlewares/accountIsVerified.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register/vendor', registervendor);
router.post('/verify-email', verifyEmail);
router.post('/verify-email/resendCode', resendVerificationCode);
router.post('/login', isVerifiedAccount, login);
router.post('/admin/login', adminLogin);
router.post('/google-signin', signInWithGoogle);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password-vendor', forgotPasswordVendor);
router.post('/reset-password-vendor/:token', resetPasswordVendor);
router.get('/logout', logout);

export default router;
