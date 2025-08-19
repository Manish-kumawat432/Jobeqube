import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String },
    resumeName: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    photo: { type: String, default: "" },
  },

  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
