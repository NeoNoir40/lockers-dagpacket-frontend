// ServiceCard.js
import React from 'react';
import LottieAnimation from './LottieAnimation';

const ServiceCard = ({ title, description, image, animationSrc }) => (
  <div className="service flex flex-col justify-around items-center bg-gray-100 w-full h-full relative overflow-hidden">
    <div className="circle absolute w-52 h-52 bg-[#FFFFFF35] rounded-full"></div>
    <div className="flex flex-col justify-center items-center px-12 gap-1">
      <h3 className="text-3xl font-medium text-center z-10">{title}</h3>
      <p className="serviceInfo text-center">{description}</p>
    </div>
    <img
      src={image}
      alt={title}
      className="z-10 transition-all"
      style={{ width: "60%", height: "70%" }}
    />
    <LottieAnimation
      src={animationSrc}
      style={{ width: "60%", height: "70%" }}
    />
  </div>
);

export default ServiceCard;
