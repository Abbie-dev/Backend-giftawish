import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandlers.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());
dotenv.config();

dbConnect();

//routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/', adminRouter);

//error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
