import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js'

// Middleware to check if user account is verified
const isVerifiedAccount = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });

    // Check if user or vendor exists and is verified
    if (user && !user.emailIsVerified) {
      return res
        .status(401)
        .json({ message: 'User account not verified. Please verify your email.' });
    } else if (vendor && !vendor.emailIsVerified) {
      return res
        .status(401)
        .json({ message: 'Vendor account not verified. Please verify your email.' });
    }

    next(); // Account is verified, proceed to next middleware or route handler
  } catch (error) {
    console.error('Error checking account verification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default isVerifiedAccount;