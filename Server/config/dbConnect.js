import mongoose from 'mongoose';
import User from '../models/userModel.js';

const updateUsersAddresses = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await User.updateMany(
        { _id: user._id },
        { $set: { address: null }, $unset: { addresses: 1 } }
      );
    }
    console.log('Users updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};
const dbConnect = async () => {
  mongoose.connect(process.env.MONGO).then(console.log('Database connected'));
  updateUsersAddresses();
};

export default dbConnect;
