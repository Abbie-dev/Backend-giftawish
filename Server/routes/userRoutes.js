import express from 'express';
import { isAuthenticated } from '../middlewares/authorization.js';
import { profileImageUpload } from '../config/multerConfig.js';
import {
  getUserProfile,
  updateUserProfile,
  getAvailableUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getFriendList,
  searchUserByUsername,
  createWishlist,
  getMyWishlists,
  addItemsToWishlist,
  removeItemFromWishlist,
  deleteWishlist,
} from '../controllers/userCtrl.js';

const router = express.Router();

router.get('/profile/:id', isAuthenticated, getUserProfile);
router.put(
  '/profile/:id',
  isAuthenticated,
  profileImageUpload,
  updateUserProfile
);

router.get('/searchUsers', isAuthenticated, searchUserByUsername);
//friend request routes
router.get('/available-users', isAuthenticated, getAvailableUsers);
router.post('/addFriend', isAuthenticated, sendFriendRequest);
router.post('/acceptFriendRequest', isAuthenticated, acceptFriendRequest);
router.post('/rejectFriendRequest', isAuthenticated, rejectFriendRequest);
router.post('/unfriendUser', isAuthenticated, unfriendUser);
router.post('/blockUser', isAuthenticated, blockUser);
router.post('/unblockUser', isAuthenticated, unblockUser);
router.get('/getBlockedusers', isAuthenticated, getBlockedUsers);
router.get('/getFriendlist', isAuthenticated, getFriendList);

//wishlist routes

router.post("/createWishlist", isAuthenticated, createWishlist);
router.get('/myWishlists', isAuthenticated, getMyWishlists);
router.post('/wishlist/:wishlistId/addItems', isAuthenticated, addItemsToWishlist);
router.delete('/wishlist/:wishlistId/removeItem/:itemId', isAuthenticated, removeItemFromWishlist);
router.delete('/wishlists/:wishlistId', isAuthenticated, deleteWishlist)

export default router;
