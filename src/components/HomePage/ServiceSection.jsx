import React from 'react';
import ServiceCard from './ServiceCard';

const ServiceSection = ({ services }) => (
  <div className="grid grid-cols-3 bg-red-600 w-full h-[35vh]">
    {services.map((service, index) => (
      <ServiceCard
        key={index}
        title={service.title}
        description={service.description}
        image={service.image}
        animationSrc={service.animationSrc}
        onClick={() => handleClick(service.path)}
      />
    ))}
  </div>
);

const handleClick = (path) => {
  window.location.href = path;
};

export default ServiceSection;
