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

        //handle image deletion

        if (req.body.deleteImage) {
            const imagesToDelete = req.body.deleteImage;
            productToUpdate.images = productToUpdate.images.filter((_, index) => !imagesToDelete.includes(index))
        }
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.filename)
            const imageToReplaceIndex = req.body.imageToReplace;
            if (imageToReplaceIndex !== undefined) {
                //replace the image at the specified index

                if (imageToReplaceIndex >= 0 && imageToReplaceIndex < productToUpdate.images.length) {
                    productToUpdate.images[imageToReplaceIndex] = newImages[0];
                } else {
                    return res.status(400).json({ message: 'Invalid image at index' });
                }
            } else {
                //append the new images or replace the existing
                if (productToUpdate.images.length + newImages.length <= 6) {

                    productToUpdate.images = [...productToUpdate.images, ...newImages]
                } else {
                    return res.status(400).json({ message: 'Maximum 6 images allowed' });
                }
            }
            const updatedProduct = await productToUpdate.save()
            res.status(200).json(updatedProduct)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})
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