import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PORT } from '../config/Apiconfig';
import { setCompanies} from '../redux/companySlice';

const useGetAllCompany = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${PORT}company/get`, { withCredentials: true });
        console.log("Response:", res);

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        } else {
          toast.error("Failed to fetch jobs!");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };

    fetchCompanies();
  }, []);
};

export default useGetAllCompany;
