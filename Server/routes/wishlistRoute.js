import express from 'express';
import { isAuthenticated } from '../middlewares/authorization.js';
import {
  createWishlist,
  getMyWishlists,
  addItemsToWishlist,
  removeItemFromWishlist,
  deleteWishlist,
  getWishlistById,
  viewSharedWishlist,
} from '../controllers/wishlistCtrl.js';

const router = express.Router();

//wishlist routes

router.post('/createWishlist', isAuthenticated, createWishlist);
router.get('/myWishlists', isAuthenticated, getMyWishlists);
router.get('/wishlist/:wishlistId', isAuthenticated, getWishlistById);
router.post(
  '/wishlist/:wishlistId/addItems',
  isAuthenticated,
  addItemsToWishlist
);
router.delete(
  '/wishlist/:wishlistId/removeItem/:itemId',
  isAuthenticated,
  removeItemFromWishlist
);
router.delete(
  '/wishlists/:wishlistId/deleteWishlist',
  isAuthenticated,
  deleteWishlist
);

router.get('/share-wishlist/:token', viewSharedWishlist);

export default router;
