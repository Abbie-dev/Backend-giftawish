import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import vendorRouter from './routes/vendorRoutes.js';
import productsRouter from './routes/productRoutes.js';
import wishlistRouter from './routes/wishlistRoute.js';
import orderRouter from './routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandlers.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());
dotenv.config();

dbConnect();

//routes
app.use('/api/', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/products', productsRouter);
app.use('/api/user', wishlistRouter);
app.use('/api/user', orderRouter);

// Catch-all route handler for the root path
app.get('/', (req, res) => {
  res.send(
    `Welcome to my API!, click here to see the <a href= https://app.swaggerhub.com/apis-docs/NANAHICE2015_1/GiftAWish/1.0>API documentation </a>`
  );
});

//error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
