import React, { useState } from 'react';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PORT } from '../../config/Apiconfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';

const PostJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirement: '',
    salary: '',
    location: '',
    jobType: '',
    exprienceLavel: '',
    position: '',
    companyId: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const validate = () => {
    const newErrors = {};
    Object.entries(input).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        newErrors[key] = `*${key} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const inputClass = (field) => {
    const base = 'w-full px-3 py-2 rounded focus:outline-none transition duration-200';
    const errorClass = errors[field]
      ? 'border-2 border-red-500 animate-pulse'
      : 'border border-gray-300 focus:ring-2 focus:ring-blue-500';
    return `${base} ${errorClass}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${PORT}job/post`,
        {
          ...input,
          salary: Number(input.salary),
          exprienceLavel: Number(input.exprienceLavel),
          position: Number(input.position),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Job posted successfully!");

        setTimeout(() => {
          navigate('/admin/jobs');
        }, 1500);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
      console.error("❌ Post Job Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
 <div className="relative h-4">
 <button
  type="button"
  className="ml-40 flex items-center gap-2 text-red-400 border border-red-400 hover:border-blue-600 hover:text-blue-600 px-3 py-1.5 rounded-full transition duration-200 mt-4"
  onClick={() => navigate(-1)}
>
  <FaRegArrowAltCircleLeft size={18} />
  <span className="text-sm">Back</span>
</button>

</div>


      <div className="flex items-center justify-center bg-gray-100 m-7">
        
        <form
          onSubmit={handleSubmit}
          className="bg-white p-9 shadow-lg rounded-md w-full max-w-2xl"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
            Create a <span className="text-blue-600">New Job</span> Opening
          </h2>
          <p className="text-sm text-center mb-8">
            Fill in the form below to post a job vacancy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'title', type: 'text' },
              { name: 'description', type: 'text' },
              { name: 'requirement', type: 'text' },
              { name: 'salary', type: 'number' },
              { name: 'location', type: 'text' },
              { name: 'exprienceLavel', type: 'number' },
              { name: 'position', type: 'number' },
            ].map(({ name, type }) => (
              <div key={name}>
                <label className="block mb-1 font-medium capitalize">{name}</label>
                <input
                  type={type}
                  name={name}
                  value={input[name]}
                  onChange={changeEventHandler}
                  className={inputClass(name)}
                />
                {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium capitalize">Job Type</label>
              <select
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className={inputClass("jobType")}
              >
                <option value="">-- Select Job Type --</option>
                <option value="Remote">Remote</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>

              </select>
              {errors.jobType && <p className="text-red-600 text-xs mt-1">{errors.jobType}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-1 font-medium">Select Company</label>
            <select
              name="companyId"
              value={input.companyId}
              onChange={changeEventHandler}
              className={inputClass("companyId")}
            >
              <option value="">-- Select a Company --</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <p className="text-red-600 text-xs mt-1">{errors.companyId}</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 flex items-center justify-center gap-2 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? 'Posting...' : 'Submit Job'}
            </button>
          </div>

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
