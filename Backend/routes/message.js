import express from 'express';
import { sendMessage, getMessages, markMessageAsRead } from '../controllers/messageController.js';
import { isAuthenticated } from '../middleware/isAuthenticate.js';

const router = express.Router();

// router.post('/send', isAuthenticated, sendMessage);
// router.get('/', isAuthenticated, getMessages);
router.route("/send").post(isAuthenticated, sendMessage)
router.route("/get").post(isAuthenticated, getMessages)
router.route('/:id/read').patch( isAuthenticated, markMessageAsRead);


export default router;
