import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

export const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ numberOfOrders: -1 })
      .limit(3);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
export const searchProducts = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
export const newProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(10);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
export const filterProducts = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
