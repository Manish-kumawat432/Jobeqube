import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import axios from 'axios';
import { PORT } from '../../config/Apiconfig';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateApplicantStatus } from '../../redux/applicationSlice';

const ApplicantTable = ({ applicants = [] }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); 
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${PORT}application/status/${id}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Status updated to "${status}"`);
        dispatch(updateApplicantStatus({ id, status }));
        setOpenMenu(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const filteredApplicants = Array.isArray(applicants)
    ? applicants.filter(app =>
        statusFilter === 'all' ? true : app.status === statusFilter
      )
    : [];

  return (
    <div className="overflow-x-auto bg-white shadow rounded-md mt-9 p-4">
      <div className="flex items-center justify-end mb-4">
        <label className="mr-2 font-medium text-sm text-gray-600">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm text-sm"
        >
          <option value="all">All</option>
          <option value="pendding">Pendding</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-300 text-sm text-left mb-5">
        <thead className="bg-gray-200 text-gray-700 font-semibold">
          <tr>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Contact</th>
            <th className="px-6 py-3">Resume</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {filteredApplicants.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                No applicants found.
              </td>
            </tr>
          ) : (
            filteredApplicants.map((app, idx) => (
              <tr key={app._id || idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{app?.applicant?.name || 'N/A'}</td>
                <td className="px-6 py-4">{app?.applicant?.email || 'N/A'}</td>
                <td className="px-6 py-4">{app?.applicant?.number || 'N/A'}</td>
                <td className="px-6 py-4">
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold capitalize
                    ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}
                  `}>
                    {app.status || 'pendding'}
                  </span>
                </td>
                <td className="px-6 py-4 relative cursor-pointer" ref={menuRef}>
                  <button
                    onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === idx && (
                    <div className="absolute right-9 top-2 z-50 bg-white border rounded-md shadow-lg w-32">
                      <button
                        onClick={() => statusHandler('accepted', app._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-green-100 text-green-600 font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => statusHandler('rejected', app._id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
