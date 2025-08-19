import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { PORT } from '../config/Apiconfig'
import { setAllAppliedJobs } from '../redux/jobSlice'
const useGetAppliedJob = () => {
const dispatch=useDispatch()
useEffect(()=>{
 const fetchAppliedJobs=async()=>{
try {
    const res=await axios.get(`${PORT}application/get`,{withCredentials:true})
   console.log(res.data);
   
    if(res.data.success){
        dispatch(setAllAppliedJobs(res.data.application))
    }
} catch (error) {
    console.log(error);
    
}
 }
fetchAppliedJobs();
},[])

}

export default useGetAppliedJob
