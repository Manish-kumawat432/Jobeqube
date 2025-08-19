import express from 'express';
import {
  getAllUsers,
  getMe,
  getMyProfile,
  getSavedJobs,
  login,
  logout,
  register,
  saveJob,
  unsaveJob,
  updateProfile
} from '../controllers/user.js';
import isAuthenticated from '../middleware/isAuthenticate.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), register);

router.post('/login', login);
router.get('/logout', logout);

router.post(
  '/profile/update',
  isAuthenticated,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  updateProfile
); router.post('/userProfile', isAuthenticated, getMyProfile);

router.post('/save-job', isAuthenticated, saveJob);
router.post('/unsave-job', isAuthenticated, unsaveJob);
router.get('/saved-jobs', isAuthenticated, getSavedJobs);

router.get('/me', isAuthenticated, getMe);
router.get('/users', isAuthenticated, getAllUsers);

export default router;
