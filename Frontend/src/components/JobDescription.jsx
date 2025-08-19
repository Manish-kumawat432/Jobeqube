import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSingleJob } from '../redux/jobSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PORT } from '../config/Apiconfig';
import {FaRegArrowAltCircleLeft } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

const JobDescription = () => {
  const dispatch = useDispatch();
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const params = useParams();
  const jobId = params.id;
  const navigate = useNavigate();

  const [isApplied, setisApplied] = useState(false);

  useEffect(() => {
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${PORT}job/get/${jobId}`, { withCredentials: true });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setisApplied(
            res.data.job.application.some(app => app.applicant === user?._id)
          );
        } else {
          toast.error("Failed to fetch job details!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${PORT}application/apply/${jobId}`, {}, { withCredentials: true });

      if (res.data.success) {
        setisApplied(true);
        const updateSingleJob = {
          ...singleJob,
          application: [...singleJob.application, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message || "Job Applied Successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />

        <div className="relative h-4">
             <button
              type="button"
              className="ml-52 flex items-center gap-2 text-red-400 border border-red-400 hover:border-blue-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition duration-200 mt-4"
              onClick={() => navigate(-1)}
            >
              <FaRegArrowAltCircleLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
            
            </div >

      <div className='max-w-7xl mx-auto my-10'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-bold text-xl'>{singleJob?.title || "Loading Title..."}</h1>
            <div className='flex gap-2 mt-4 flex-wrap'>
              <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm'>
                {singleJob?.position || "0"} Positions
              </span>
              <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold shadow-sm'>
                {singleJob?.jobType || "Job Type"}
              </span>
              <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold shadow-sm'>
                {singleJob?.salary || "Package"} LPA
              </span>
            </div>
          </div>

          <button
            className={`text-white px-4 py-2 rounded transition ${isApplied
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-gray-200 hover:text-black cursor-pointer'}`}
            onClick={isApplied ? null : applyJobHandler}
          >
            {isApplied ? 'Already Applied' : 'Apply'}
          </button>
        </div>

        <h1 className='font-bold border-b-2 border-b-gray-300 py-4 mt-4'>Job Details :-</h1>

        <div className='my-4'>
          <h1 className='font-bold my-1'>
            Role:
            <span className='pl-4 font-normal text-gray-800'>{singleJob?.title || "N/A"}</span>
          </h1>

          <h1 className='font-bold my-1'>
            Location:
            <span className='pl-4 font-normal text-gray-800'>{singleJob?.location || "N/A"}</span>
          </h1>

          <h1 className='font-bold my-1'>
            Requirement:
            {Array.isArray(singleJob?.requirement)
              ? singleJob.requirement.map((skill, index) => (
                <span
                  key={index}
                  className='ml-2 px-3 py-1 text-sm bg-purple-100 text-red-500 rounded-full font-medium'
                >
                  {skill}
                </span>
              ))
              : typeof singleJob?.requirement === 'string'
                ? singleJob.requirement.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className='ml-2 px-3 py-1 text-sm bg-purple-100 text-red-800 rounded-full font-medium'
                  >
                    {skill.trim()}
                  </span>
                ))
                : <span className='px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full font-medium'>N/A</span>
            }
          </h1>

          <h1 className='font-bold my-1'>
            Experience:
            <span className='pl-4 font-normal text-gray-800'>{singleJob?.exprienceLavel || "N/A"} year</span>
          </h1>

          <h1 className='font-bold my-1'>
            Salary:
            <span className='pl-4 font-normal text-gray-800'>₹{singleJob?.salary || "N/A"} LPA</span>
          </h1>

          <h1 className='font-bold my-1'>
            Total Applicants:
            <span className='pl-4 font-normal text-gray-800'>{singleJob?.application?.length || "N/A"}</span>
          </h1>

          <h1 className='font-bold my-1'>
            Posted Date:
            <span className='pl-4 font-normal text-gray-800'>
              {singleJob?.createdAt ? new Date(singleJob.createdAt).toDateString() : "N/A"}
            </span>
          </h1>

          <h1 className='font-bold my-1'>
            Description:
            <span className='pl-4 font-normal text-gray-800'>
              {singleJob?.description || "N/A"}
            </span>
          </h1>
        </div>
      </div>
      <div className='mt-52'>
      <Footer/>
      </div>
    </>
  );
};

export default JobDescription;
