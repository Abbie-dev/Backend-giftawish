import express from 'express';
import { isVendorAuthenticated } from '../middlewares/authorization.js'
import { addProduct } from '../controllers/vendorCtrl.js'

const router = express.Router();
router.post("/addProduct", isVendorAuthenticated, addProduct)
export default router;