import React from 'react';

const MovingBanner = ({ expiryProducts, outOfStockProducts }) => {
  const stockAlerts = Array.isArray(outOfStockProducts) && outOfStockProducts.length > 0
    ? outOfStockProducts.map((product, index) => (
        <span key={index} className="text-sm text-gray-700">
          <span className="font-semibold text-green-500">{product}</span> is low in stock.
        </span>
      ))
    : [<span key="no-stock" className="text-sm text-gray-700">All products are well-stocked.</span>];

  const expiryAlerts = Array.isArray(expiryProducts) && expiryProducts.length > 0
    ? expiryProducts.map((product, index) => (
        <span key={index} className="text-sm text-gray-700">
          <span className="font-semibold text-yellow-500">{product.name}</span> is nearing expiry on{" "}
          {product.expiryDate.toLocaleDateString()}.
        </span>
      ))
    : [<span key="no-expiry" className="text-sm text-gray-700">No products are nearing expiry.</span>];

  const allAlerts = [...stockAlerts, ...expiryAlerts];

  return (
    <div className=" bg-white shadow-lg w-[1100px] opacity-90 rounded-md text-blue-950 overflow-hidden">
      <div className="flex items-center space-x-10 animate-scroll px-4 py-2">
        {allAlerts.map((alert, index) => (
          <React.Fragment key={index}>
            <span className="whitespace-nowrap text-sm md:text-lg font-semibold">{alert}</span>
            {index < allAlerts.length - 1 && (
              <span className="whitespace-nowrap text-sm md:text-lg font-semibold">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MovingBanner;
