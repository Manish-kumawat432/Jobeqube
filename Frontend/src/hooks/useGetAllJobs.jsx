import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllJobs } from '../redux/jobSlice';
import { toast } from 'react-toastify';
import { PORT } from '../config/Apiconfig';
import store from '../redux/store';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
const {searchedQuery}=useSelector(store=>store.job)
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${PORT}job/get?keyword=${searchedQuery}`, { withCredentials: true });
        console.log("Response:", res);
console.log("Search Query:", searchedQuery);

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          toast.error("Failed to fetch jobs!");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };

    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
