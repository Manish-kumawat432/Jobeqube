import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import LatestJobsCards from './LatestJobsCards';

const LatestJobs = () => {
    useGetAllJobs();
    const { jobs } = useSelector(store => store.job);

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'>
                <span className='text-[#6A38C2]'>Latest & Top </span>Job Openings
            </h1>
            <div className='grid grid-cols-3 gap-4 my-5'>
                {jobs?.length <= 0
                    ? <span>No Jobs Available</span>
                    : jobs.slice(0, 6).map((job) => (
                        <LatestJobsCards key={job._id} job={job} />
                    ))
                }
            </div>
        </div>
    );
};

export default LatestJobs;
