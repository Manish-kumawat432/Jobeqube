import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';
import axios from 'axios';
import Navbar from './Navbar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';
import Footer from './Footer';

const Browser = () =>{
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchParams] = useSearchParams();
  const searchedQuery = searchParams.get('search');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/job/getfilteredjobs', {
          params: {
            title: searchedQuery,
          },
        });
        setFilteredJobs(res.data.jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    if (searchedQuery) fetchJobs();
  }, [searchedQuery]);

  return (
    <>
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
      <div className='max-w-7xl mx-auto py-6'>
        {searchedQuery ? (
          <>
            <h2 className='text-2xl font-bold mb-5'>
              {filteredJobs.length} Jobs found for: <span className='text-purple-600'>" {searchedQuery} "</span>
            </h2>

            {filteredJobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className='text-center mt-20'>
            <h2 className='text-2xl font-bold text-gray-700'>🔍 Start Searching</h2>
            <p className='text-gray-500 mt-2'>
              Use the search bar above or pick a category to explore jobs.
            </p>

            <button
              onClick={() => navigate('/')}
              className='mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-all duration-300 cursor-pointer'
            >
              🚀 Go to Search
            </button>
          </div>
        )}
      </div>
<div className='mt-96'>
  <Footer/>
</div>
    </>
  );
};

export default Browser;
