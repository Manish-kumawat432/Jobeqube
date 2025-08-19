import express from 'express';
import isAuthenticated from '../middleware/isAuthenticate.js';
import { applyjob, getApplicant, getAppliedJobs, updateStatus } from '../controllers/application.js';

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyjob)
router.route("/get").get(isAuthenticated, getAppliedJobs)
router.route("/:id/applicants").get(isAuthenticated, getApplicant)
router.route("/status/:id/update").post(isAuthenticated, updateStatus)

export default router;
