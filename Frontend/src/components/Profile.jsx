import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import {  FaMobileAlt, FaPen,  FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfile from './UpdateProfile';
import { useSelector } from 'react-redux';
import useGetAppliedJob from '../hooks/useGetAppliedJob';
import useGetSavedJobs from '../hooks/useGetSavedJobs';
import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  useGetAppliedJob();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { savedJobs, loading } = useGetSavedJobs();

  const [localSavedJobs, setLocalSavedJobs] = useState([]);

  useEffect(() => {
    setLocalSavedJobs(savedJobs);
  }, [savedJobs]);

  const handleUnsave = (jobId) => {
    setLocalSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };
const navigate=useNavigate()
  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
  <div className="relative h-4">
       <button
        type="button"
        className="ml-28 flex items-center gap-2 text-red-400 border border-red-400 hover:border-blue-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition duration-200 mt-4"
        onClick={() => navigate(-1)}
      >
        <FaRegArrowAltCircleLeft size={18} />
        <span className="text-sm">Back</span>
      </button>
      
      </div >
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-8 p-6 shadow-sm'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <img
              className='w-14 h-14 rounded-full object-cover border'
              src={
                user?.profile?.photo
                  ? user.profile.photo
                  : 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=360'
              }
              alt='profile'
            />
            <div>
              <h1 className='font-semibold text-lg text-gray-800'>{user?.name || 'N/A'}</h1>
              <p className='text-sm text-gray-500'>{user?.profile?.bio || 'No bio available'}</p>
            </div>
          </div>
          <button className='p-2 rounded-full hover:bg-gray-100 text-gray-600' onClick={() => setOpen(true)}>
            <FaPen size={16} />
          </button>
        </div>

        <div className='my-5'>
          <div className='flex items-center gap-3 mt-6 text-gray-700'>
            <FiMail className='text-lg' />
            <span>{user?.email || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-3 mt-3 text-gray-700'>
            <FaMobileAlt className='text-lg' />
            <span>{user?.number || 'N/A'}</span>
          </div>
        </div>

        <div className='mt-6'>
          <h2 className='font-semibold text-lg mb-2'>Skills</h2>
          <div className='flex flex-wrap gap-2'>
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <span key={index} className='px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium'>
                  {item}
                </span>
              ))
            ) : (
              <span className='text-red-700'>NA</span>
            )}
          </div>
        </div>

        <div className='grid w-full max-w-sm items-center gap-1.5 mt-6'>
          <label className='text-md font-bold'>Resume</label>
          {user?.profile?.resume ? (
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
              <span className='text-gray-800'>
                {decodeURIComponent(user.profile.resume.split('/').pop().split('?')[0])}
              </span>
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className='px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600'
              >
                View
              </a>
              <a
                href={user.profile.resume.replace('/raw/upload/', '/raw/upload/fl_attachment/')}
                className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Download
              </a>
            </div>
          ) : (
            <span className='text-red-500'>NA</span>
          )}
        </div>
      </div>

      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <AppliedJobTable />
      </div>

      <div className='max-w-4xl mx-auto bg-gray rounded-2xl p-6 mb- mt-5'>
        <h2 className='text-xl font-semibold mb-4'>Saved Jobs</h2>
        {loading ? (
          <p>Loading saved jobs...</p>
        ) : localSavedJobs.length === 0 ? (
          <p className='text-red-600'>No saved jobs found.</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-4'>
            {localSavedJobs.map((job) => (
              <JobCard key={job._id} job={job} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </div>

      <UpdateProfile open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
