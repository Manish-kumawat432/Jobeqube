import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { PORT } from '../config/Apiconfig';
import { setUser } from '../redux/authSlice';
import { toast } from 'react-toastify';

const UpdateProfile = ({ open, setOpen }) => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    name: user?.name || '',
    email: user?.email || '',
    number: user?.number || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || ''
  });

  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(input).forEach(key => formData.append(key, input[key]));
    if (photo) formData.append('photo', photo);
    if (resume) formData.append('resume', resume);

    try {
      const res = await axios.post(`${PORT}user/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.updatedUser));
        setTimeout(() => setOpen(false), 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>

        {['name', 'email', 'number', 'bio', 'skills'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={input[field]}
              onChange={(e) => setInput({ ...input, [field]: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="block text-sm mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Resume (PDF/DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
