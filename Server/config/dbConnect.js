import mongoose from 'mongoose';

const dbConnect = async () => {
  mongoose.connect(process.env.MONGO).then(console.log('Database connected'));
};

export default dbConnect;
