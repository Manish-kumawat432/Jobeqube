import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import {FaRegArrowAltCircleLeft } from 'react-icons/fa';
import axios from 'axios';
import { PORT } from '../../config/Apiconfig';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import useGetCompanyById from '../../hooks/useGetCompanyById';

const CompanySetUp = () => {
  const params = useParams();
  const navigate = useNavigate();

  useGetCompanyById(params.id);

  const { singleCompany } = useSelector(store => store.company);

  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: ''
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (singleCompany && Object.keys(singleCompany).length > 0) {
      setInput({
        name: singleCompany.name || '',
        description: singleCompany.description || '',
        website: singleCompany.website || '',
        location: singleCompany.location || ''
      });
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setPhoto(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    if (photo) formData.append('logo', photo);

    try {
      const res = await axios.put(`${PORT}company/update/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message || "Company updated successfully!");
        setTimeout(() => {
          navigate('/admin/companies');
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (!singleCompany || Object.keys(singleCompany).length === 0) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-10 text-lg font-semibold text-gray-600">
          Loading Company Details...
        </div>
      </div>
    );
  }

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

      <div className='max-w-xl mx-auto my-10'>
        <form onSubmit={submitHandler} encType='multipart/form-data'>
          <div className='flex items-center gap-5 p-8'>
           
            <h1 className='font-bold text-xl'>Company Setup</h1>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label>Company Name</label>
              <input
                type='text'
                className='my-3 h-9 border border-gray-300 px-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='name'
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type='text'
                className='my-3 h-9 border border-gray-300 px-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <label>Website</label>
              <input
                type='text'
                className='my-3 h-9 border border-gray-300 px-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='website'
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <label>Location</label>
              <input
                type='text'
                className='my-3 h-9 border border-gray-300 px-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                name='location'
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div className="col-span-2">
              <label>Company Logo</label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                className="my-3 w-full"
                onChange={fileChangeHandler}
              />
            </div>
          </div>

          <button
            type='submit'
            className='bg-green-600 hover:bg-gray-500 p-2 text-white rounded cursor-pointer w-full mt-8'
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetUp;
