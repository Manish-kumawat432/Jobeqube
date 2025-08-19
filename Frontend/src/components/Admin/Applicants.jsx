import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import ApplicantTable from './ApplicantTable';
import axios from 'axios';
import { PORT } from '../../config/Apiconfig';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '../../redux/applicationSlice';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const applicants = useSelector((state) => state.application.applicants);
const navigate=useNavigate()
  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(`${PORT}application/${params.id}/applicants`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job.application));
        }
      } catch (error) {
        console.error(' Error fetching applicants:', error);
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div>
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
      <div className="max-w-7xl mx-auto mt-9">
        <h1 className="font-bold text-xl my-5 mt-5">
          Applicants ({Array.isArray(applicants) ? applicants.length : 0})
        </h1>
        <ApplicantTable applicants={applicants} />
      </div>
    </div>
  );
};

export default Applicants;
