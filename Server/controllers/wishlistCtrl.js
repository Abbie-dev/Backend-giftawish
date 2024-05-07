import User from '../models/userModel.js';
import Wishlist from '../models/wishlistModel.js';
import asyncHandler from 'express-async-handler';

export const createWishlist = asyncHandler(async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    const user = req.user._id;

    // Validate that eventDate is provided and is a valid date
    if (!eventDate || isNaN(Date.parse(eventDate))) {
      return res.status(400).json({ error: 'Invalid event date' });
    }

    const wishlist = new Wishlist({
      user,
      title,
      description,
      eventDate: new Date(eventDate),
      items: [],
    });

    const createdWishlist = await wishlist.save();

    await User.findByIdAndUpdate(user, {
      $push: { wishlist: createdWishlist._id },
    });
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

export const getWishlistById = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status.json({ error: error.message });
  }
});
export const addItemsToWishlist = asyncHandler(async (req, res) => {
  try {
    const wishlistId = req.params;
    const { productIds, categoryIds, priority } = req.body;
  } catch (error) {
    console.log(error);
    res.status.json({ error: error.message });
  }
});

export const removeItemFromWishlist = asyncHandler(async (req, res) => {});
export const deleteWishlist = asyncHandler(async (req, res) => {
  const wishlistId = req.params.wishlistId;
  const user = req.user._id;
  const wishlistToDelete = await Wishlist.findByIdAndDelete(wishlistId);
  if (!wishlistToDelete) {
    return res.status(404).json({ message: 'Wishlist not found' });
  } else {
    await User.findByIdAndUpdate(user, {
      $pull: { wishlist: wishlistId },
    });
    res.status(200).json({ message: 'Wishlist deleted' });
  }
});
