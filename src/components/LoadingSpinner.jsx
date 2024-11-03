import React from 'react';

function LoadingSpinner() {
  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-500">
     <div div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
  </div>
  );
}
export default LoadingSpinner;
