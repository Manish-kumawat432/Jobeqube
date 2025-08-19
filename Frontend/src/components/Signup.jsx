import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PORT } from '../config/Apiconfig';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/authSlice';

const Signup = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errObj = {};

    if (!name) errObj.name = 'Name is required';
    if (!email) errObj.email = 'Email is required';
    if (!password) errObj.password = 'Password is required';
    if (!number) errObj.number = 'Mobile number is required';
    if (!role) errObj.role = 'Role selection is required';
    if (!bio) errObj.bio = 'Bio is required'; 

    setErrors(errObj);
    if (Object.keys(errObj).length > 0) {
      toast.error('Please fill all fields!');
      return;
    }

    const userData = {
      name,
      email,
      password,
      number,
      role,
      bio,
      skills: [],
      company: ""
    };

    console.log("Sending Data:", userData);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${PORT}user/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res?.data?.message) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error('Signup failed! Try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={handleSubmit} className='w-1/2 border border-blue-400 rounded-md p-4 my-10 shadow-md'>
          <h1 className='font-bold text-xl mb-5 text-center text-blue-600'>SignUp</h1>

          <div className='my-4'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter Your Name'
              className='font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
          </div>

          <div className='my-4'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Your Email'
              className='font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
          </div>

          <div className='my-4'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Your Password'
              className='font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
          </div>

          <div className='my-4'>
            <input
              type='number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder='Enter Your Mobile Number'
              className='font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.number && <p className='text-red-500 text-sm'>{errors.number}</p>}
          </div>

          <div className='my-4'>
            <label className='font-bold cursor-not-allowed'>Select Role:</label>
            <div className='flex gap-5 mt-2 font-bold cursor-pointer'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={handleRoleChange}
                  className='mr-2 cursor-pointer'
                />
                Student
              </label>
              <label className='flex items-center cursor-pointer'>
                <input
                  type="radio"
                  value="recruiter"
                  checked={role === 'recruiter'}
                  onChange={handleRoleChange}
                  className='mr-2 cursor-pointer'
                />
                Recruiter
              </label>
            </div>
            {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
          </div>

          <div className='my-4'>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Write something about yourself'
              className='font-bold border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.bio && <p className='text-red-500 text-sm'>{errors.bio}</p>}
          </div>

          <button
            type='submit'
            className='bg-green-500 text-white rounded px-4 py-2 w-full hover:bg-green-600 transition duration-300 flex justify-center items-center gap-2'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          <p className='mt-4 text-center'>Already have an account? <Link to="/login" className='text-blue-500 underline'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup;
