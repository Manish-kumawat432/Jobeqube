import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filterard";
import JobCard from "./JobCard";
import axios from "axios";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Jobs = () => {
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    jobType: "",
  });

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchFilteredJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/job/getfilteredjobs", {
          params: filters,
        });
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchFilteredJobs();
  }, [filters]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
const navigate=useNavigate()
  return (
    <div>
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
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-1/4">
            <FilterCard filters={filters} setFilters={setFilters} />
          </div>

          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {jobs.length <= 0 ? (
              <span className="text-center text-gray-500">Job Not Found</span>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                <div className="flex justify-center items-center mt-6 gap-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Jobs;
