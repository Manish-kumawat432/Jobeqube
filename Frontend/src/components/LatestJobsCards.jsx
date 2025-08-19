import React from 'react';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className='rounded-xl shadow-xl p-6 bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer'
    >

      <div className='flex items-center gap-4'>
        <img
          src={job?.company?.logo || "https://via.placeholder.com/100"}
          alt="company-logo"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h1 className='text-lg font-semibold'>{job?.company?.name || "Company Name"}</h1>
          <p className='text-gray-500'>{job?.location || "Unknown location"}</p>
        </div>
      </div>

      <div className='mt-4'>
        <h1 className='text-md font-semibold'>{job?.title}</h1>
        <p className='text-gray-600'>
          {job?.description?.slice(0, 90) || "No description"}....
        </p>
      </div>

      <div className='flex gap-2 mt-4 flex-wrap'>
        {job?.position && (
          <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm'>
            {job.position} Position{job.position > 1 ? 's' : ''}
          </span>
        )}
        {job?.jobType && (
          <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold shadow-sm'>
            {job.jobType}
          </span>
        )}
        {job?.salary && (
          <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold shadow-sm'>
            ₹ {job.salary} LPA
          </span>
        )}
      </div>
    </div>
  );
};

export default LatestJobCards;
