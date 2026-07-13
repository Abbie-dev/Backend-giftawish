import mongoose from 'mongoose';
import User from '../models/userModel.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default dbConnect;
