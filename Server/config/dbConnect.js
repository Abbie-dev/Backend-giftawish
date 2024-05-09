import mongoose from 'mongoose';
import User from '../models/userModel.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Database connected');
    await removeAddressesField();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};
const removeAddressesField = async () => {
  try {
    const result = await User.updateMany(
      {},
      { $unset: { addresses: [] } },
      { multi: true }
    );
    console.log(`${result.modifiedCount} user documents updated successfully.`);
  } catch (error) {
    console.error('Error updating users:', error);
  }
};
export default dbConnect;
