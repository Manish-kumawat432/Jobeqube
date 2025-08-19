import express from 'express';
import {
  deleteCompany,
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany
} from '../controllers/company.js';
import isAuthenticated from '../middleware/isAuthenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, upload.single('logo'), updateCompany); 
router.delete('/:id', isAuthenticated, deleteCompany);

export default router;
