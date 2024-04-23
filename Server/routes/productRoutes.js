import express from 'express';

import {
  getTopProducts,
  searchProducts,
  newProducts,
} from '../controllers/productCtrl.js';

const router = express.Router();

router.get('/topProducts', getTopProducts);
router.get('/searchProducts', searchProducts);
router.get('/newProducts', newProducts);

export default router;
