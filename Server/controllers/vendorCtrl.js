import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import Product from '../models/productModel.js';
import Vendor from '../models/vendorModel.js';
import { productImageUpload } from '../config/multerConfig.js';

export const addProduct = asyncHandler(async (req, res) => {
  const vendor = req.vendor._id;
  const { name, description, price, category, tags } = req.body;
  try {
    // Check if a product with the same slug already exists
    const existingProduct = await Product.findOne({
      slug: slugify(name, { lower: true, strict: true }),
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: 'A product with the same name already exists' });
    }

    const images = req.files.map((file) => file.filename);
    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      tags,
      vendor,
    });
    product.slug = slugify(product.name, { lower: true, strict: true });
    const createdProduct = await product.save();

    await Vendor.findByIdAndUpdate(vendor, {
      $push: { products: createdProduct._id },
    });
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productToUpdate = await Product.findById(req.params.id);
    if (!productToUpdate) return res.status(404).json('Product not found');

    productToUpdate.name = req.body.name || productToUpdate.name;
    productToUpdate.description =
      req.body.description || productToUpdate.description;
    productToUpdate.price = req.body.price || productToUpdate.price;
    productToUpdate.category = req.body.category || productToUpdate.category;
    productToUpdate.tags = req.body.tags || productToUpdate.tags;

    // Handle image deletion
    if (req.body.imagesToDelete) {
      const imagesToDelete = req.body.imagesToDelete;
      productToUpdate.images = productToUpdate.images.filter(
        (_, index) => !imagesToDelete.includes(index)
      );
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      const imageToReplaceIndex = req.body.imageToReplace;

      if (imageToReplaceIndex !== undefined) {
        // Replace the image at the specified index
        if (
          imageToReplaceIndex >= 0 &&
          imageToReplaceIndex < productToUpdate.images.length
        ) {
          productToUpdate.images[imageToReplaceIndex] = newImages[0];
        } else {
          return res
            .status(400)
            .json({ message: 'Invalid imageToReplace index' });
        }
      } else {
        // Append new images or replace existing images
        if (productToUpdate.images.length + newImages.length <= 6) {
          productToUpdate.images = [...productToUpdate.images, ...newImages];
        } else {
          return res
            .status(400)
            .json({ message: 'Maximum 6 images can be uploaded' });
        }
      }
    }

    const updatedProduct = await productToUpdate.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export const allProductsByVendor = asyncHandler(async (req, res) => {
  try {
    const companyName = req.query.companyName || req.body.companyName;
    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    const vendor = await Vendor.findOne({ companyName });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    const products = await Product.find({ vendor });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export const deleteImage = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const imageIndex = req.query.index; // Assuming the index of the image to delete is passed as a query parameter

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the image index is valid
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Remove the image from the product's images array
    product.images.splice(imageIndex, 1);

    // Save the updated product
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(productId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
