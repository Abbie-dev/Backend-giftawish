import express from 'express';

import {
  getTopProducts,
  searchProducts,
  newProducts,
  getAllProducts,
  getProductById,
} from '../controllers/productCtrl.js';

const router = express.Router();

router.get('/product/:id', getProductById);
router.get('/allProducts', getAllProducts);
router.get('/topProducts', getTopProducts);
router.get('/search', searchProducts);
router.get('/newProducts', newProducts);

export default router;
