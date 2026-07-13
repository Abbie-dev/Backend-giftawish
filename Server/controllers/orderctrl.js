import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

export const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    items,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    receiverDetails,
    senderDetails,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  try {
    const order = new Order({
      user: req.user._id,
      shippingAddress,
      items,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalPrice,
      isPaid: true, // Auto-paid for mock checkout
      paidAt: new Date(),
      paymentMethod,
      receiverDetails,
      senderDetails,
    });

    const createdOrder = await order.save();

    // Update product order counts
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { numberOfOrders: item.qty },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
