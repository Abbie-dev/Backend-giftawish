import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

export const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({ path: 'category', select: 'name -_id' })
      .populate({ path: 'vendor', select: 'companyName -_id' })
      .sort({ numberOfOrders: -1 })
      .limit(10)
      .lean();

    const updatedProducts = products.map((product) => {
      const availableQuantity = product.quantity - product.numberOfOrders;
      const instock = availableQuantity > 0;
      const { inStock, ...rest } = product;
      return { ...rest, availableQuantity, instock };
    });
    res.json(updatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
export const searchProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const filters = {};

    //filter by query
    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [q] } },
      ];
    }
    //filter by category
    if (category) {
      filters.category = category;
    }
    //filter by price range

    if (minPrice && maxPrice) {
      filters.price = {
        $gte: minPrice,
        $lte: maxPrice,
      };
    } else if (minPrice) {
      filters.price = {
        $gte: minPrice,
      };
    } else if (maxPrice) {
      filters.price = {
        $lte: maxPrice,
      };
    }

    //sorting options
    const sortOptions = {};
    if (sortBy === 'popularity') {
      sortOptions.numberOfOrders = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'newest') {
      sortOptions.createdAt = order === 'desc' ? -1 : 1;
    } else if (sortBy === 'price') {
      sortOptions.price = order === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filters)
      .populate({ path: 'category', select: 'name -_id' })
      .populate({ path: 'vendor', select: 'companyName -_id' })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    const totalProduct = await Product.countDocuments(filters);
    res.json({
      products,
      totalProduct,
      currentPage: page,
      totalPages: Math.ceil(totalProduct / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export const newProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({ path: 'category', select: 'name -_id' })
      .populate({ path: 'vendor', select: 'companyName -_id' })
      .sort({ _id: -1 })
      .limit(10)
      .lean();

    const updatedProducts = products.map((product) => {
      const availableQuantity = product.quantity - product.numberOfOrders;
      const instock = availableQuantity > 0;
      const { inStock, ...rest } = product;
      return { ...rest, availableQuantity, instock };
    });
    res.json(updatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
