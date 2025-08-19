import React, { useState } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PORT } from '../../config/Apiconfig';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '../../redux/companySlice';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${PORT}company/register`,
        { companyName },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message || "Company created successfully!");

        const companyId = res?.data?.company?._id;

        setTimeout(() => {
          navigate(`/admin/companies/${companyId}`);
        }, 1500);
      }
    } catch (error) {
      console.log("Error:", error);
      const msg = error.response?.data?.message || "Failed to create company";
      toast.error(msg);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative h-4">
       <button
        type="button"
        className="ml-40 flex items-center gap-2 text-red-400 border border-red-400 hover:border-blue-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition duration-200 mt-4"
        onClick={() => navigate(-1)}
      >
        <FaRegArrowAltCircleLeft size={18} />
        <span className="text-sm">Back</span>
      </button>
      
      </div>

      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          className="w-1/2 border border-blue-400 rounded-md p-6 my-10 shadow-md"
          onSubmit={(e) => {
            e.preventDefault();
            registerNewCompany();
          }}
        >
          <h1 className="font-bold text-xl mb-5 text-center text-red-600">
            Create Your Company
          </h1>

          <div className="my-4">
            <label className="font-bold mb-2 block">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-red-500 text-white px-4 py-2 rounded transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-green-500 text-white px-4 py-2 rounded transition duration-300"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreate;
