import { Job } from '../models/job.js';
import mongoose from 'mongoose';

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirement,
      salary,
      location,
      jobType,
      exprienceLavel,
      position,
      companyId
    } = req.body;

    const userId = req.id;

    if (
      !title || !description || !requirement || !salary || !location ||
      !jobType || !exprienceLavel || !position || !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    const parsedRequirement = Array.isArray(requirement)
      ? requirement
      : requirement.split(',').map(item => item.trim());

    const job = await Job.create({
      title,
      description,
      requirement: parsedRequirement,
      salary: Number(salary),
      location,
      jobType,
      exprienceLavel: Number(exprienceLavel),
      position: Number(position),
      company: companyId,
      created_by: userId
    });

    return res.status(200).json({
      message: "Job added successfully",
      job,
      success: true
    });
  } catch (error) {
    console.error("postJob error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const escapeRegex = (str) => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const regex = new RegExp(escapeRegex(keyword), "i");

    const query = {
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    };

    const jobs = await Job.find()
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        jobs: [],
        message: "No matching jobs found"
      });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "application"
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false })
    }
    return res.status(200).json({ job, success: true })

  } catch (error) {
    console.log(error);

  }
}

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.user._id;

    console.log("🔍 Fetching jobs for admin:", adminId);

    const jobs = await Job.find({ created_by: adminId }).populate("company");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "Jobs not found", success: false });
    }

    res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log("❌ getAdminJobs Error:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
export const getFilteredJobs = async (req, res) => {
  try {
    const { title, location, jobType } = req.query;

    console.log("Received filters in backend:", req.query);
    const query = {};

    if (title) query.title = new RegExp(title, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = new RegExp(`^${jobType.trim()}$`, 'i');

    console.log("MongoDB query object:", query);

    const jobs = await Job.find(query).populate('company created_by');

    console.log("Matched Jobs Count:", jobs.length);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Filter error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    res.status(200).json({ message: "Job deleted successfully", success: true });

  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
