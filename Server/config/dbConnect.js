import mongoose from 'mongoose';
import User from '../models/userModel.js';

const dbConnect = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default dbConnect;
