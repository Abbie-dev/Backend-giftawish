import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import Product from '../models/productModel.js';
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

        const productImages = req.files.map(file => file.filename)
        const product = new Product({ name, description, price, images: productImages, category, tags, vendor })
        product.slug = slugify(product.name, { lower: true, strict: true })
        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
})
