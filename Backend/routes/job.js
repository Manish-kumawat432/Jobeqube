import express from 'express';
import isAuthenticated from '../middleware/isAuthenticate.js';
import { deleteJob, getAdminJobs, getAllJobs, getFilteredJobs, getJobById, postJob, updateJob } from '../controllers/job.js';

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob)
router.route("/get").get(getAllJobs)
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs)
router.route("/get/:id").get(isAuthenticated, getJobById)
router.route("/getfilteredjobs").get(isAuthenticated, getFilteredJobs)
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/update/:id").put(isAuthenticated, updateJob);
export default router;
