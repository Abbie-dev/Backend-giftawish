import express from 'express';

import {
  getTopProducts,
  searchProducts,
  newProducts,
  filterProducts,
} from '../controllers/productCtrl.js';

const router = express.Router();

router.get('/topProducts', getTopProducts);
router.get('/searchProducts', searchProducts);
router.get('/newProducts', newProducts);
router.get('/filterProducts', filterProducts);

export default router;
