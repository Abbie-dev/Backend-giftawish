import express from 'express';
import {} from '../controllers/orderctrl.js';
import { isAuthenticated } from '../middlewares/authorization.js';

const router = express.Router();

export default router;
