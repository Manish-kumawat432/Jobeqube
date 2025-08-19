import { Company } from "../models/company.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ message: "Company name is required", success: false });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ message: "You can't add the same company", success: false });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true
    });
  } catch (error) {
    console.error("Register company error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "Companies not found", success: false });
    }

    return res.status(200).json({
      message: "Companies found successfully",
      companies,
      success: true
    });
  } catch (error) {
    console.error("Get company error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    return res.status(200).json({
      message: "Company found successfully",
      company,
      success: true
    });
  } catch (error) {
    console.error("Get company by ID error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const updateData = {
      name,
      description,
      website,
      location,
    };

    if (file) {
      const uploadResult = await uploadToCloudinary(file.path); 
      console.log("Cloudinary upload result:", uploadResult);
      updateData.logo = uploadResult.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    return res.status(200).json({
      message: "Company info updated successfully",
      company,
      success: true
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const id = req.params.id;
    await Company.findByIdAndDelete(id);
    res.status(200).json({ message: 'Company deleted successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete company', success: false });
  }
};