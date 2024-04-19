import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ error: 'You are not authorized' });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ error: 'You are not authorized as an admin' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
export const isVendorAuthenticated = asyncHandler(async (req, res, next) => { })