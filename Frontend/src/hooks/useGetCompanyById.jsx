import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PORT } from '../config/Apiconfig';
import { setSingleCompany } from '../redux/companySlice';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${PORT}company/get/${companyId}`, { withCredentials: true });
        console.log("Response:", res);

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          toast.error("Failed to fetch jobs!");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };

    fetchSingleCompany();
  }, [companyId,dispatch]);
};

export default useGetCompanyById;
