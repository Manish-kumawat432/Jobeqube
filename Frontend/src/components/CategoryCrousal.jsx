import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const category = [
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Frontend Developer",
  "MERN Stack Developer",
  "Full Stack Developer"
];

const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-[-35px] transform -translate-y-1/2 cursor-pointer z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-200"
    onClick={onClick}
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-[-70px] transform -translate-y-1/2 cursor-pointer z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-200"
    onClick={onClick}
  >
    <FaArrowLeft />
  </div>
);

const CategoryCarousel = () => {
  const navigate = useNavigate();

  const searchHandler = (query) => {
    navigate(`/browser?search=${encodeURIComponent(query.trim())}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
     autoplay: true,          
  autoplaySpeed: 1000,  
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className='relative max-w-3xl mx-auto my-10'>
      <Slider {...settings}>
        {category.map((cat, index) => (
          <div key={index} className='p-4'>
            <button
              onClick={() => searchHandler(cat)}
              className='text-red-400 border border-red-400 hover:border-blue-600 hover:text-blue-600 rounded-full w-30 h-12 flex items-center justify-center transition-all duration-300 px-4 cursor-pointer'
            >
              {cat}
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;
