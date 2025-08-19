import React, { useEffect, useState } from 'react';
import { FiTable } from 'react-icons/fi';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAllAdminJobs } from '../../redux/jobSlice';
import { PORT } from '../../config/Apiconfig';

const AdminJobsTable = () => {
  const { allAdminJobs = [], searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAllJobs = async () => {
    try {
      const res = await axios.get(`${PORT}job/getadminjobs`);
      dispatch(setAllAdminJobs(res.data.jobs));
    } catch (error) {
      toast.error("Failed to fetch jobs");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${PORT}job/delete/${jobId}`);
      toast.success("Job deleted successfully ");
      fetchAllJobs();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      const search = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(search) ||
        job?.company?.name?.toLowerCase().includes(search)
      );
    });
    setFilterJobs(filtered);
    setCurrentPage(1);
  }, [allAdminJobs, searchJobByText]);

  const totalPages = Math.ceil(filterJobs.length / limit);
  const paginatedJobs = filterJobs.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="p-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 my-2">
          <FiTable /> A List of your recent posted jobs
        </h2>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead className="border border-gray-300 bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Company Name</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Posted On</th>
            <th className="py-2 px-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job, index) => (
              <tr key={index} className="text-left hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {job.company?.name || 'N/A'}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {job.title || 'No Title'}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {job.createdAt?.split('T')[0] || 'N/A'}
                </td>
                <td className="py-2 px-4 border border-gray-300 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5 text-blue-900" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View Applicants"
                    >
                      <Eye className="w-5 h-5 text-green-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No jobs posted yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div className="text-sm">
          Show:&nbsp;
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          &nbsp;entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminJobsTable;
