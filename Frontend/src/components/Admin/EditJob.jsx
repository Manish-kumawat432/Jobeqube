import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PORT } from '../../config/Apiconfig';
import Navbar from '../Navbar';
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: '',
    company: '',
  });

  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${PORT}company/get`);
      setCompanies(res.data.companies);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`${PORT}job/get/${id}`);
      const job = res.data.job;

      setForm({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        type: job.type,
        company: job.company?._id || '',
      });
    } catch (error) {
      toast.error('Failed to fetch job details');
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${PORT}job/update/${id}`, form);
      toast.success('Job updated successfully ✅');
      navigate('/admin/jobs');
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  useEffect(() => {
    fetchJobDetails();
    fetchCompanies();
  }, []);

  return (
    <>
    <Navbar/>
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>

        </select>

        <select
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Company</option>
          {companies.map((comp) => (
            <option key={comp._id} value={comp._id}>
              {comp.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Job
        </button>
      </form>
    </div>
    </>
  );
};

export default EditJob;
