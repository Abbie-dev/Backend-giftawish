import express from 'express';

import { getTopProducts, searchProducts } from '../controllers/productCtrl.js';

const router = express.Router();

router.get('/topProducts', getTopProducts);
router.get('/searchProducts', searchProducts);

export default router;
