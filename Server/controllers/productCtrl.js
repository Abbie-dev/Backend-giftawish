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
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'category',
        select: 'name -_id', // Specify the fields from the Category model that you want to populate
      })
      .populate({ path: 'vendor', select: 'companyName -_id' })
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: 'category', select: 'name -_id' })
      .populate({ path: 'vendor', select: 'companyName -_id' })
      .lean();

    if (product) {
      const availableQuantity = product.quantity - product.numberOfOrders;
      const responseData = { ...product, availableQuantity };
      res.json(responseData);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
