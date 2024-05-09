import mongoose from 'mongoose';
import User from '../models/userModel.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Database connected');
    await updateUsersAddresses();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

const updateUsersAddresses = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await User.updateOne({ _id: user._id }, { $unset: { addresses: 1 } });
    }
    console.log('Users updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};
export default dbConnect;
