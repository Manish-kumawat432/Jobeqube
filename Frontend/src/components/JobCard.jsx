import React, { useEffect, useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { PORT } from '../config/Apiconfig';
import { updateSavedJobs } from '../redux/authSlice';

const JobCard = ({ job, onUnsave, disableSave = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user?.savedJobs?.some((id) => id.toString() === job._id.toString())) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [user, job._id]);

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error('Please login to save jobs');
            return;
        }

        try {
            let updatedSavedJobs = [];

            if (isSaved) {
                await axios.post(
                    `${PORT}user/unsave-job`,
                    { jobId: job._id },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                        withCredentials: true,
                    }
                );
                toast.info('Job removed from saved');
                updatedSavedJobs = user.savedJobs.filter(
                    (id) => id.toString() !== job._id.toString()
                );
                setIsSaved(false);

                if (onUnsave) {
                    onUnsave(job._id);
                }
            } else {
                await axios.post(
                    `${PORT}user/save-job`,
                    { jobId: job._id },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                        withCredentials: true,
                    }
                );
                toast.success('Job saved');
                updatedSavedJobs = [...(user.savedJobs || []), job._id];
                setIsSaved(true);
            }

            dispatch(updateSavedJobs(updatedSavedJobs));
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        }
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    return (
        <div
            className="p-5 rounded-md shadow-xl w-full bg-white border border-gray-100 cursor-pointer transition hover:shadow-2xl"
            onClick={() => navigate(`/description/${job._id}`)}
        >
            <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">
                    {daysAgoFunction(job?.createdAt) === 0
                        ? 'Today'
                        : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                {!disableSave && (

                    <button
                        className="text-xl text-blue-500 p-1 hover:text-gray-400 transition"
                        onClick={handleBookmarkClick}
                    >
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center mt-4">
                <img
                    src={job?.company?.logo || 'https://via.placeholder.com/100'}
                    alt="company-logo"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <p className="text-lg font-medium mt-1">{job?.company?.name || 'Company'}</p>
                <p className="text-sm text-gray-500">{job?.location || 'Location not provided'}</p>
            </div>

            <div>
                <h1 className="font-bold text-lg my-2">{job?.title}</h1>
                <p className="text-sm text-gray-600">
                    {job?.description?.slice(0, 90) || 'No description'}...
                </p>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
                {job?.position && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                        {job.position} Position{job.position > 1 ? 's' : ''}
                    </span>
                )}
                {job?.jobType && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold shadow-sm">
                        {job.jobType}
                    </span>
                )}
                {job?.salary && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold shadow-sm">
                        ₹ {job.salary} LPA
                    </span>
                )}
            </div>
        </div>
    );
};

export default JobCard;
