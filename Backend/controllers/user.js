import { User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import path from "path";

export const register = async (req, res) => {
  try {
    const { name, email, number, password, role, bio, skills, company } = req.body;

    if (!name || !email || !number || !password || !role || !bio) {
      return res.status(400).json({ message: "Some fields are missing", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    let resumeUrl = "";

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        const photoUpload = await cloudinary.v2.uploader.upload(req.files.photo[0].path, {
          folder: "JobPortal/ProfilePhotos"
        });
        profilePhotoUrl = photoUpload.secure_url;
      }

      if (req.files.resume && req.files.resume[0]) {
        const resumeUpload = await cloudinary.v2.uploader.upload(req.files.resume[0].path, {
          resource_type: "raw",
          folder: "JobPortal/Resumes"
        });
        resumeUrl = resumeUpload.secure_url;
      }
    }

    let parsedSkills = [];
    try {
      if (skills && typeof skills === "string" && skills.trim() !== "") {
        parsedSkills = JSON.parse(skills);
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid format for skills", success: false });
    }

    const newUser = await User.create({
      name,
      email,
      number,
      password: hashedPassword,
      role,
      profile: {
        bio,
        skills: parsedSkills,
        company: company || null,
        photo: profilePhotoUrl,
        resume: resumeUrl
      }
    });

    return res.status(200).json({
      message: "User created successfully",
      success: true,
      user: newUser
    });

  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      message: "Server Error",
      success: false
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Kuch fields missing hain", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please fill correct email", success: false });

    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) return res.status(400).json({ message: "Please fill correct  password", success: false });

    if (role !== user.role) {
      return res.status(400).json({ message: "Please select correct role ", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '365d' });

    const isDevelopment = process.env.NODE_ENV !== 'production';

    const userWithoutPassword = await User.findById(user._id).select('-password');

    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isDevelopment ? 'Lax' : 'None',
        secure: isDevelopment ? false : true
      })
      .json({
        message: `Welcome back ${user.name} as a ${user.role}`,
        user: userWithoutPassword,
        success: true
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logout Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, email, number, bio, skills } = req.body;
    const files = req.files;
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (number) user.number = number;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map(s => s.trim());

    if (files?.photo?.[0]) {
      const uploadedPhoto = await cloudinary.v2.uploader.upload(files.photo[0].path, {
        folder: 'JobPortal/ProfilePhotos',
        timeout: 60000
      });
      user.profile.photo = uploadedPhoto.secure_url;
    }

    if (files?.resume?.[0]) {
      const resumeFile = files.resume[0];

      const originalNameWithoutExt = path.parse(resumeFile.originalname).name;
      const safePublicId = originalNameWithoutExt.replace(/\s+/g, "_");

      const uploadedResume = await cloudinary.v2.uploader.upload(resumeFile.path, {
        folder: 'JobPortal/Resumes',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: false,
        public_id: safePublicId,
        timeout: 60000
      });

      user.profile.resume = uploadedResume.secure_url;
      user.profile.resumeName = resumeFile.originalname;

      console.log("Resume URL:", uploadedResume.secure_url);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
      success: true
    });

  } catch (error) {
    console.log("Update error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      role: user.role,
      profile: {
        bio: user.profile?.bio || "",
        photo: user.profile?.photo || "",
        skills: user.profile?.skills || [],
        resume: user.profile?.resume || ""
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Job saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
};


export const unsaveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ success: true, message: 'Job unsaved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'savedJobs',
      populate: { path: 'company' },
    });

    res.status(200).json({ success: true, jobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
};



export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("getMe Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.id } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
