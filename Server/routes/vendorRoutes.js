import express from 'express';
import { productImageUpload } from "../config/multerConfig.js"
import { isVendorAuthenticated } from '../middlewares/authorization.js'
import { addProduct, updateProduct, allProductsByVendor } from '../controllers/vendorCtrl.js'

const router = express.Router();
router.post("/addProduct", isVendorAuthenticated, productImageUpload, addProduct)
router.put('/updateProduct/:id', isVendorAuthenticated, productImageUpload, updateProduct)
router.get("/allProducts", isVendorAuthenticated, allProductsByVendor)
export default router;