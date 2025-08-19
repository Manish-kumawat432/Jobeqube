import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchHandler = () => {
    if (!query.trim()) return;
    navigate(`/browser?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          Welcome to Jobqube        </span>
        <h1 className="text-5xl font-bold">
          Search, Apply &<br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Find your dream jobs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full"
          />
          <button
            onClick={searchHandler}
            className="rounded-r-full bg-[#6A38C2] hover:bg-green-500 p-2 text-white transition-colors duration-300"
          >
            <FiSearch className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
