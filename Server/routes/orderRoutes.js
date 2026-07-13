import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderctrl.js';
import { isAuthenticated } from '../middlewares/authorization.js';

const router = express.Router();

router.post('/orders', isAuthenticated, createOrder);
router.get('/orders/myorders', isAuthenticated, getMyOrders);

export default router;
