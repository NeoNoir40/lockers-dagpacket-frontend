// MobileServices.js
import React from 'react';

export default function MobileServices({ service, onSelectProduct }) {
  // Calculate the number of items
  const itemCount = service.length;

  return (
    <div
      className={`grid ${itemCount < 3 ? 'grid-cols-1' : 'grid-cols-3'} px-5 py-5 gap-7 items-center justify-center`}
    >
      {service.map((product) => (
        <ul
          className="flex flex-col items-center justify-center text-center bg-white px-5 py-5 rounded-md shadow-md cursor-pointer hover:scale-105"
          key={product.ProductId}
          onClick={() => onSelectProduct(product)}
        >
          <li>
            <img
              className="w-[25%] h-25 mx-auto"
              src={product.ReferenceParameters.Reference1.URLImage}
              alt={product.ProductName}
            />
          </li>
          <li>{product.ProductName}</li>
          <li>
            {product.Amount} {product.CurrencyCode}
          </li>
        </ul>
      ))}
    </div>
  );
}
