import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/authorization.js';
import { getAllUsers, getAllVendors } from '../controllers/adminCtrl.js';

const router = express.Router();

router.get('/all-users', isAuthenticated, isAdmin, getAllUsers);
router.get('/all-vendors', isAuthenticated, isAdmin, getAllVendors);

export default router;
