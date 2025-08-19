import React, { useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCrousal';
import LatestJobs from './LatestJobs';
import Footer from './Footer';
import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import store from '../redux/store';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader'; 

const Home = () => {
  useGetAllJobs(); 

  const { user } = useSelector(store => store.auth);
  const { loading } = useSelector(store => store.job); 
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer/>
    </div>
  );
}

export default Home;
