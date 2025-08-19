import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PORT } from '../config/Apiconfig';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../redux/authSlice';
import { FiLoader } from 'react-icons/fi';

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector(state => state.auth);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errObj = {};
    if (!email) errObj.email = 'Email is required';
    if (!password) errObj.password = 'Password is required';
    if (!role) errObj.role = 'Role selection is required';

    setErrors(errObj);

    if (Object.keys(errObj).length > 0) {
      toast.error('Please fill all fields!');
      return;
    }

    const input = { email, password, role };

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${PORT}user/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (res?.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Login Failed!');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={handleSubmit} className='w-1/2 border border-blue-400 rounded-md p-4 my-10 shadow-md'>
          <h1 className='font-bold text-xl mb-5 text-center text-red-600'>Login</h1>

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

          <div className='my-4 '>
            <label className='font-bold cursor-pointer'>Select Role:</label>
            <div className='flex gap-5 mt-2 font-bold '>
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

          {loading ? (
            <button className='w-full my-4 flex items-center justify-center bg-gray-200 py-2 rounded'>
              <FiLoader className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </button>
          ) : (
            <button
              type='submit'
              className='bg-green-500 text-white rounded px-4 py-2 w-full hover:bg-green-600 transition duration-300 cursor-pointer'
            >
              Login
            </button>
          )}

          <p className='mt-4 text-center'>
            Don't have an account? <Link to="/signup" className='text-blue-500 underline'>SignUp</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
