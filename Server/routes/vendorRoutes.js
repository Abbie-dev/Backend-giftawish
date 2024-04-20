import express from 'express';
import { productImageUpload } from "../config/multerConfig.js"
import { isVendorAuthenticated } from '../middlewares/authorization.js'
import { addProduct } from '../controllers/vendorCtrl.js'

const router = express.Router();
router.post("/addProduct", isVendorAuthenticated, productImageUpload, addProduct)
export default router;