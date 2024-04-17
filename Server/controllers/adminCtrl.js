import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js';
import asyncHandler from 'express-async-handler';

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const allVendors = await Vendor.find({});
    res.status(200).json(allVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
