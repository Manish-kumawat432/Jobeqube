import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllAdminJobs } from '../redux/jobSlice';
import { toast } from 'react-toastify';
import { PORT } from '../config/Apiconfig';

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        console.log("📡 Fetching admin jobs from:", `${PORT}job/getadminjobs`);

        const res = await axios.get(`${PORT}job/getadminjobs`, {
          withCredentials: true,
        });

        console.log("✅ API Response Status:", res.status);
        console.log("📦 Response Data:", res.data);

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        } else {
          toast.error("❌ Failed to fetch jobs (API success false)");
        }
      } catch (error) {
        console.error("🚨 API Error:", error);
        console.error("🔍 Response Error Object:", error.response);

        toast.error(error.response?.data?.message || "❌ Something went wrong!");
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
