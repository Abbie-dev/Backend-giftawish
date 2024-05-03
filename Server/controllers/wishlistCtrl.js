import User from '../models/userModel.js';
import Wishlist from '../models/wishlistModel.js';
import asyncHandler from 'express-async-handler';

export const createWishlist = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.user._id;
    const wishlist = new Wishlist({ user, title, description });

    const createdWishlist = await wishlist.save();
    res.status(200).json(createdWishlist);
  } catch (error) {
    console.log(error);
    res.status.json({ error: error.message });
  }
});
export const getMyWishlists = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const wishlists = await Wishlist.find({ user });
    if (!wishlists) {
      return res.status(404).json({ message: 'You dont have any wishlist' });
    }
    res.status(200).json(wishlists);
  } catch (error) {
    console.log(error);
    res.status.json({ error: error.message });
  }
});

export const getWishlistById = asyncHandler(async (req, res) => {});
export const addItemsToWishlist = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
  } catch (error) {
    console.log(error);
    res.status.json({ error: error.message });
  }
});

export const removeItemFromWishlist = asyncHandler(async (req, res) => {});
export const deleteWishlist = asyncHandler(async (req, res) => {});
