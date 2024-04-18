import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/authorization.js';
import { getAllUsers, getAllVendors, createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/adminCtrl.js';

const router = express.Router();

router.get('/all-users', isAuthenticated, isAdmin, getAllUsers);
router.get('/all-vendors', isAuthenticated, isAdmin, getAllVendors);
router.post('/createCategory', isAuthenticated, isAdmin, createCategory)
router.get('/categories', isAuthenticated, isAdmin, getAllCategories);
router.put('/updateCategory', isAuthenticated, isAdmin, updateCategory);
router.delete('/deleteCategory', isAuthenticated, isAdmin, deleteCategory);

export default router;
