import { Application } from "../models/application.js";
import { Job } from "../models/job.js";

export const applyjob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(404).json({ message: "Job id is required", success: false })
    }

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId })
    if (existingApplication) {
      return res.status(404).json({ message: "You have already applied this job", success: false })
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false })
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.application.push(newApplication._id);
    await job.save();
    return res.status(200).json({ message: "Job applied successfully", success: true })

  } catch (error) {
    console.log(error);

  }
}

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
      path: "job",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },

      }
    });
    if (!application) {
      return res.status(404).json({ message: "No Appication", success: false })
    }
    return res.status(200).json({ application, success: true })

  } catch (error) {
    console.log(error);

  }
}

export const getApplicant = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "application",
        options: { sort: { createdAt: -1 } },
        populate: { path: "applicant" }
      });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ message: `Status updated to ${status}`, success: true });
  } catch (error) {
    console.log('Update status error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};
