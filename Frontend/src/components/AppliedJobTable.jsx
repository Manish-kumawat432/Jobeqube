import React, { useState } from 'react';
import { FiTable } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredJobs = allAppliedJobs.filter((job) =>
    statusFilter === 'all' ? true : job.status === statusFilter
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <FiTable /> Applied Jobs Table
        </h2>

        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-sm font-medium">Filter by Status:</label>
          <select
            id="statusFilter"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pendding">Pendding</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <table className='min-w-full bg-white border border-gray-200'>
        <thead className='bg-blue-100 border'>
          <tr>
            <th className='py-2 px-4 border text-center'>Date</th>
            <th className='py-2 px-4 border text-center'>Job Role</th>
            <th className='py-2 px-4 border text-center'>Company</th>
            <th className='py-2 px-4 border text-center'>Status</th>
          </tr>
        </thead>

        <tbody>
          {currentJobs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-6">
                You haven't applied to any jobs with this status.
              </td>
            </tr>
          ) : (
            currentJobs.map((appliedJob) => (
              <tr key={appliedJob._id} className='text-center'>
                <td className='py-2 px-4 border'>{appliedJob?.createdAt?.split("T")[0]}</td>
                <td className='py-2 px-4 border'>{appliedJob.job?.title}</td>
                <td className='py-2 px-4 border'>{appliedJob.job?.company?.name}</td>
                <td className='py-2 px-4 border'>
                  <span className={
                    `${appliedJob?.status === "rejected"
                      ? 'bg-red-400'
                      : appliedJob?.status === "pendding"
                        ? 'bg-gray-400'
                        : 'bg-green-400'
                    } text-white py-1 px-3 rounded-full text-xs font-bold`
                  }>
                    {appliedJob.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => changePage(num + 1)}
              className={`px-3 py-1 border rounded ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                } hover:bg-blue-600 hover:text-white text-sm`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;
