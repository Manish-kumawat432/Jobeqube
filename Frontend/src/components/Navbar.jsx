import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { FaRegCommentDots, FaRegBell } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { PORT } from '../config/Apiconfig';
import { setUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setShowMenu(prev => !prev);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${PORT}user/logout`, { withCredentials: true });
      dispatch(setUser(null));
      navigate('/');
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  // Default profile image
  const defaultImage = 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg?w=360';

  // Final profile image condition
  const profileImage = (user?.role === 'student' && user?.profile?.photo) ? user.profile.photo : defaultImage;

  return (
    <div className='bg-white relative z-50 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
        <div>
          <Link to="/">
            <div className="text-center leading-tight">
              <h1 className="text-3xl font-bold text-blue-700 font-playfair">Job<span className='text-red-500'>qube</span></h1>
              <p className="text-xs tracking-widest text-gray-500 uppercase">Unbox Your Career</p>
            </div>
          </Link>
        </div>

        <div>
          <ul className='flex font-medium items-center gap-5'>
            {user && user.role === 'recruiter' ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browser">Browse</Link></li>
              </>
            )}

            {user && (
              <>
                <li className="relative cursor-pointer text-blue-700">
                  <Link to="/chat">
                    <FaRegCommentDots size={20} />
                  </Link>
                </li>

                <li className="relative cursor-pointer text-red-600">
                  <Link to="/notifications">
                    <FaRegBell size={20} />
                  </Link>
                </li>
              </>
            )}

            {user ? (
              <div className="relative">
                <img
                  onClick={toggleMenu}
                  className="w-7 h-7 rounded-full ring-2 ring-white cursor-pointer object-cover"
                  src={profileImage}
                  alt='profile'
                />

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        className='w-14 h-14 rounded-full object-cover border'
                        src={profileImage}
                        alt='profile'
                      />
                      <div>
                        <h2 className="text-sm font-semibold text-gray-800">{user.name || "User Name"}</h2>
                        <p className="text-xs text-gray-500">{user.email || "user@email.com"}</p>
                      </div>
                    </div>

                    <hr className="my-2" />

                    {user?.role === 'student' && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
                      >
                        <FiUser /> View Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 text-sm text-red-500 hover:bg-gray-100 px-3 py-2 rounded mt-1"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-3 py-2 text-xs font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800">
                    SignUp
                  </button>
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
