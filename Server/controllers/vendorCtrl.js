import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import Product from '../models/productModel.js';
import Vendor from '../models/vendorModel.js'
import { productImageUpload } from '../config/multerConfig.js'


export const addProduct = asyncHandler(async (req, res) => {
    const vendor = req.vendor._id;
    const { name, description, price, category, tags } = req.body;
    try {
        // Check if a product with the same slug already exists
        const existingProduct = await Product.findOne({ slug: slugify(name, { lower: true, strict: true }) });
        if (existingProduct) {
            return res.status(400).json({ error: 'A product with the same name already exists' });
        }

        const images = req.files.map(file => file.filename)
        const product = new Product({ name, description, price, images, category, tags, vendor })
        product.slug = slugify(product.name, { lower: true, strict: true })
        const createdProduct = await product.save()

        await Vendor.findByIdAndUpdate(vendor, { $push: { products: createdProduct._id } })
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})
export const updateProduct = asyncHandler(async (req, res) => {
    try {

        const productToUpdate = await Product.findById(req.params.id);;
        if (!productToUpdate) return res.status(404).json('Product not found');

        productToUpdate.name = req.body.name || productToUpdate.name
        productToUpdate.description = req.body.description || productToUpdate.description
        productToUpdate.price = req.body.price || productToUpdate.price
        productToUpdate.category = req.body.category || productToUpdate.category
        productToUpdate.tags = req.body.tags || productToUpdate.tags

        if (req.files) {
            productToUpdate.images = req.files.filename
        }
        const updatedProduct = await productToUpdate.save()
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
export const allProductsByVendor = asyncHandler(async (req, res) => {
    try {
        const vendor = req.vendor._id;
        const products = await Product.find({ vendor })
        res.status(200).json(products)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})