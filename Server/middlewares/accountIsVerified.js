import User from '../models/userModel.js';

// Middleware to check if user account is verified
const isVerifiedAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user.emailIsVerified) {
      return res
        .status(401)
        .json({ message: 'Account not verified. Please verify your email.' });
    }
    next(); // User account is verified, proceed to next middleware or route handler
  } catch (error) {
    console.error('Error checking account verification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export default isVerifiedAccount;
