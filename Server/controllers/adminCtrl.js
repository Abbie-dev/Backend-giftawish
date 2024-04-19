import User from '../models/userModel.js';
import Vendor from '../models/vendorModel.js';
import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const allVendors = await Vendor.find({});
    res.status(200).json(allVendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  try {
    const findCategory = await Category.findOne({ name })
    if (findCategory) { return res.status(400).json("Category already exists") }
    const category = new Category({ name, description })
    //generate the slug before saving the document
    category.slug = slugify(category.name, { lower: true, strict: true })
    await category.save()

    return res.status(200).json({ category, message: "category created successfully" })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const updateCategory = asyncHandler(async (req, res) => {
  try {


  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const deleteCategory = asyncHandler(async (req, res) => {
  try {

    const { id } = req.params;
    const findCategory = await Category.findById(id)
    if (!findCategory) { return res.status(400).json("Category does not exist") }
    const category = await Category.findByIdAndDelete(id)
    return res.status(200).json({ category, message: "category deleted successfully" })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const allCategories = await Category.find({});
    if (!allCategories) {
      return res.status(400).json({
        message: "No categories found"
      })
    }
    res.status(200).json(allCategories);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});