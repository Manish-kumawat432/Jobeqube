import { useEffect, useState } from "react";
import axios from "axios";
import { PORT } from "../config/Apiconfig";

const useGetSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${PORT}user/saved-jobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setSavedJobs(res.data.jobs);
        } else {
          setSavedJobs([]);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error.message);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  return { savedJobs, loading };
};

export default useGetSavedJobs;
