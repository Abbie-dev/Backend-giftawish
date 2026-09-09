import mongoose from 'mongoose';
import User from '../models/userModel.js';

const dbConnect = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGO, {
      dbName: process.env.DB_NAME || 'giftawish',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`Database connected successfully to database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export default dbConnect;
