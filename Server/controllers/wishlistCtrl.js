import User from '../models/userModel.js';
import Wishlist from '../models/wishlistModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

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
    const wishlists = await Wishlist.find({ user }).sort({ eventDate: 1 });
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
    const wishlistId = req.params.wishlistId;
    const user = req.user._id;
    const wishlist = await Wishlist.findById({
      _id: wishlistId,
      user,
    }).populate({
      path: 'items.product',
      select: 'name price images',
    });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const token = jwt.sign(
      { wishlistId: wishlist._id, user: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    const shareLink = `${req.protocol}://${req.get(
      'host'
    )}/share-wishlist/${token}`;

    res.status(200).json({ wishlist, shareLink });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
export const addItemsToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlistId = req.params.wishlistId;
  const user = req.user._id;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { _id: wishlistId, user },
      { $push: { items: { product: productId } } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlistId = req.params.wishlistId;
  const user = req.user._id;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { _id: wishlistId, user },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
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

export const viewSharedWishlist = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    //verify and decode the jwt token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { wishlistId, userId } = decoded;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
    }).populate('items.product', 'name price images');

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
