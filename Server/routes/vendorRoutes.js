import express from 'express';
import { productImageUpload } from '../config/multerConfig.js';
import { isVendorAuthenticated } from '../middlewares/authorization.js';
import {
  addProduct,
  updateProduct,
  allProductsByVendor,
  deleteProduct,
  uploadProductImage,
} from '../controllers/vendorCtrl.js';

const router = express.Router();
router.post('/addProduct', isVendorAuthenticated, addProduct);

router.put(
  '/uploadProductImages/:id',
  isVendorAuthenticated,
  productImageUpload,
  uploadProductImage
);
router.put(
  '/updateProduct/:id',
  isVendorAuthenticated,
  productImageUpload,
  updateProduct
);

router.get('/allProducts', allProductsByVendor);
router.delete('/removeProduct/:id', isVendorAuthenticated, deleteProduct);
export default router;
