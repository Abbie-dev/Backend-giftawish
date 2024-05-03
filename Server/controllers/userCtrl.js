import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { profileImageUpload } from '../config/multerConfig.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'friends.userId',
        select: 'username',
      })
      .populate({ path: 'wishlist', select: 'title description -_id' });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
      });
    } else {
      const userWithoutFriendIds = {
        ...user._doc,
        friends: user.friends.map((friend) => ({
          userId: friend.userId._id,
          username: friend.userId.username,
          status: friend.status,
        })),
      };
      res.status(200).json(userWithoutFriendIds);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
      });
    } else {
      //check if a profile image was uploaded

      if (req.file) {
        user.profileImage = req.file.filename;
      }

      // Parse the birthday string into a Date object
      const birthdayString = req.body.birthday;
      const birthday = birthdayString
        ? new Date(birthdayString)
        : user.birthday;
      // update the user profile with the new fields

      user.firstname = req.body.firstname || user.firstname;
      user.lastname = req.body.lastname || user.lastname;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.birthday = birthday;

      await user.save();

      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//search user by username

export const searchUserByUsername = asyncHandler(async (req, res) => {
  try {
    const { searchTerm } = req.query;
    //find users with username that match the search term

    const users = await User.find({
      username: { $regex: new RegExp(searchTerm, 'i') },
    }).select('-password -email ');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//friend requests

//see all available users and add friends

export const getAvailableUsers = asyncHandler(async (req, res) => {
  const PAGE_SIZE = 10; // Number of users to display per page
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided

  try {
    const friendIds = req.user.friends.map((friend) => friend.userId);
    const userId =
      req.user._id instanceof mongoose.Types.ObjectId
        ? req.user._id
        : new mongoose.Types.ObjectId(req.user._id);
    // Count total available users
    const totalUsers = await User.countDocuments({
      _id: { $nin: [...friendIds, userId] }, // Not already friends and not the current user
      isAdmin: false, // Not admin users
    });

    // Calculate skip value based on page number and page size
    const skip = (page - 1) * PAGE_SIZE;

    const availableUsers = await User.find({
      _id: { $nin: [...friendIds, userId] },
      isAdmin: false,
    })
      // .select(-'friends')
      .skip(skip)
      .limit(PAGE_SIZE);
    res.status(200).json({
      availableUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / PAGE_SIZE),
    });
  } catch (error) {
    console.error('Error fetching available users:', error);
    res.status(500).json(error.message);
  }
});

//send friend request

export const sendFriendRequest = asyncHandler(async (req, res) => {
  try {
    const senderUsername = req.user.username;
    const { recipientUsername } = req.body;
    //find both users

    const sender = await User.findOne({ username: senderUsername });
    const reciever = await User.findOne({ username: recipientUsername });

    if (!sender || !reciever) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (sender.id === reciever.id) {
      return res.status(400).json({ message: 'cannot add yorself' });
    }

    //send friend request
    if (reciever.friends.length > 0) {
      for (let i = 0; i < reciever.friends.length; i++) {
        const element = reciever.friends[i];
        if (!element.userId.equals(sender.id)) {
          continue;
        } else {
          return res.status(200).json({
            message: `Request status ${element.status}, yet to accept your friend request`,
          });
        }
      }
      reciever.friends.push({ userId: sender._id });
      reciever.save();
      return res.status(200).json({ message: 'Request sent successfully' });
    } else {
      reciever.friends.push({ userId: sender._id });
      await reciever.save();
      return res.status(200).json({ message: 'Request sent successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
//accept friend request

export const acceptFriendRequest = asyncHandler(async (req, res) => {
  try {
    const receiverUsername = req.user.username;
    const { senderUsername } = req.body;
    //find users by username

    const self = await User.findOne({ username: receiverUsername });
    const sender = await User.findOne({ username: senderUsername });

    if (!self || !sender) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (self.id === sender.id) {
      return res.status(400).json({ message: 'cannot add yorself' });
    }
    //accept friend request

    self.friends.forEach((element) => {
      if (element.userId.equals(sender._id) && element.status === 'pending') {
        element.status = 'accepted';
        sender.friends.push({ userId: self._id, status: 'accepted' });
      }
    });
    await self.save();
    await sender.save();
    return res.status(200).json({
      message: `Request accepted successfully, you are now friends with ${sender.username}`,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

//decline friend request
export const rejectFriendRequest = asyncHandler(async (req, res) => {
  try {
    const receiverUsername = req.user.username;
    const { senderUsername } = req.body;
    const self = await User.findOne({ username: receiverUsername });
    const usernameToReject = await User.findOne({ username: senderUsername });
    if (!self || !usernameToReject) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (self.id === usernameToReject.id) {
      return res.status(400).json({ message: 'cannot add yorself' });
    }

    self.friends.forEach((element) => {
      if (
        element.userId.equals(usernameToReject._id) &&
        element.status === 'pending'
      ) {
        self.friends.pop(element);
      }
    });
    await self.save();
    return res.status(200).json({
      message: 'Request rejected successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//unfriend user
export const unfriendUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user.username;
    const { usernameToUnfriend } = req.body;
    const self = await User.findOne({ username: user });
    const userToUnfriend = await User.findOne({ username: usernameToUnfriend });

    if (!self || !userToUnfriend) {
      return res.status(404).json({ message: 'User not found' });
    }

    //check if the users are friends

    const isFriends = self.friends.some(
      (friend) =>
        friend.userId.toString() === userToUnfriend._id.toString() &&
        friend.status === 'accepted'
    );

    if (!isFriends) {
      return res
        .status(400)
        .json({ message: 'You are not friends with this user' });
    }
    // Remove userToUnfriend from self's friends array
    await User.findOneAndUpdate(
      {
        _id: self._id,
      },
      { $pull: { friends: { userId: userToUnfriend._id, status: 'accepted' } } }
    );
    // Remove self from userToUnfriend's friends array

    await User.findOneAndUpdate(
      {
        _id: userToUnfriend._id,
      },
      { $pull: { friends: { userId: self._id, status: 'accepted' } } }
    );

    return res.status(200).json({
      message: `You have unfriended ${usernameToUnfriend}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//block user
export const blockUser = asyncHandler(async (req, res) => {
  try {
    const self = req.user.username;
    const { username } = req.body;
    if (self === username) {
      return res.status(400).json({ message: 'cannot block yourself' });
    }
    // Find the user who is doing the blocking
    const user = await User.findOne({ username: self });
    // Find the user to be blocked
    const userToBlock = await User.findOne({ username: username });
    // Check if both users exist
    if (!user || !userToBlock) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user to be blocked is already in the blocked users list

    if (user.blockedUsers.includes(userToBlock._id)) {
      return res.status(400).json({ message: 'User already blocked' });
    }

    // Add the user to be blocked to the blockedUsers array

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { blockedUsers: userToBlock._id } }
    );
    //remove the usertoblock from the user's friends array

    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { friends: { userId: userToBlock._id } } }
    );
    //Remove the user to be blocked from the friends array(if they are friends

    await User.findOneAndUpdate(
      { _id: userToBlock._id },
      { $pull: { friends: { userId: user._id } } }
    );
    return res.status(200).json({ message: 'user blocked successfully  ' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//unblock user

export const unblockUser = asyncHandler(async (req, res) => {
  try {
    const self = req.user.username;
    const { username } = req.body;
    //find the user who is doing the unblocking operation

    const user = await User.findOne({ username: self });
    //find the user to be unblocked

    const userToUnblock = await User.findOne({ username: username });
    //check if both users exist

    if (!user || !userToUnblock) {
      return res.status(404).json({ message: 'User not found' });
    }

    //check if the user to be unblocked is already in the blocked users list

    if (!user.blockedUsers.includes(userToUnblock._id)) {
      return res.status(400).json({ message: 'User not blocked' });
    }

    //remove the user to be unblocked from the blockedUsers array
    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { blockedUsers: userToUnblock._id } }
    );
    return res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
//get list of friends
export const getFriendList = asyncHandler(async (req, res) => {
  try {
    const username = req.user.username;

    //find the user

    const currentUser = await User.findOne({ username: username }).populate({
      path: 'friends.userId',
      select: 'username profile ',
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    //get the list of accepted friends

    const friends = currentUser.friends.filter(
      (friend) => friend.status === 'accepted'
    );

    res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
// get list of blocked users
export const getBlockedUsers = asyncHandler(async (req, res) => {
  try {
    const username = req.user.username;
    //find the user
    const currentUser = await User.findOne({ username: username }).populate({
      path: 'blockedUsers.userId',
      select: 'username',
    });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(currentUser.blockedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
