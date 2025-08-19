import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchJobByText } from '../../redux/jobSlice';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs';

const AdminJobs = () => {
  useGetAllAdminJobs();

  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-9'>
        <div className='flex items-center justify-between'>
          <input
            className='w-fit h-9 border border-gray-300 rounded hover:bg-gray-100 shadow-lg px-2'
            placeholder='Filter by job title or company...'
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            className='bg-orange-600 hover:bg-green-500 p-2 text-white rounded cursor-pointer'
            onClick={() => navigate('/admin/jobs/create')}
          >
            New Job
          </button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;
