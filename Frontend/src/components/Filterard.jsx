import React from "react";

const FilterData = [
  {
    filterType: "location",
    array: ["Jaipur", "Delhi", "Mumbai", "Bangalore"],
  },
  {
    filterType: "title",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "WordPress Developer",
    ],
  },
  {
    filterType: "jobType",
    array: ["Remote", "Full-Time", "Part-Time" , "Hybird" , "On-site"],
  },
];

const filterTypeLabelMap = {
  location: "Location",
  title: "Job Title",
  jobType: "Job Type",
};

const FilterCard = ({ filters, setFilters }) => {
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? "" : value,
    }));
  };

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="text-xl font-bold mb-3">Filter Jobs</h1>
      <hr className="mb-4" />

      {FilterData.map((data, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-medium mb-2 font-bold capitalize">
            {filterTypeLabelMap[data.filterType] || data.filterType}
          </h2>

          {data.array.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                name={data.filterType}
                value={item}
                checked={filters[data.filterType] === item}
                onChange={() => handleFilterChange(data.filterType, item)}
                className="cursor-pointer"
                id={`${data.filterType}-${item}`}
              />
              <label htmlFor={`${data.filterType}-${item}`} className="cursor-pointer">
                {item}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() =>
          setFilters({
            title: "",
            location: "",
            jobType: "",
          })
        }
        className="text-blue-600 mt-4 underline cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterCard;
