import express from 'express';

import {
  getTopProducts,
  searchProducts,
  newProducts,
  filterProducts,
  getAllProducts,
  getProductById,
} from '../controllers/productCtrl.js';

const router = express.Router();

router.get('/product/:id', getProductById);
router.get('/allProducts', getAllProducts);
router.get('/topProducts', getTopProducts);
router.get('/searchProducts', searchProducts);
router.get('/newProducts', newProducts);
router.get('/filterProducts', filterProducts);

export default router;
