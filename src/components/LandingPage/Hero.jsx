import React from 'react';

function Hero() {
  return (
    <div className="text-white w-full">
      <div className="bg-green-900 min-h-[40vh] flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="w-full md:w-1/2 pl-12">
            <h1 className="text-4xl font-bold mb-4 ">
              Your Prescription for Affordable Health Solutions!
            </h1>
            <p className="text-lg mb-8">
              Elevate your health journey with exclusive discounts and
              unparalleled convenience. Your path to well-being starts here,
              where every purchase is a prescription for savings.
            </p>
            <a
              href="#"
              className="inline-block bg-green-200 text-green-900 font-bold py-3 px-6 rounded-full hover:bg-green-300 transition-all duration-300"
            >
              Start Prescribing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-6 w-6 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18M9 9l-6 6m0 0l6 6m-6-6h18"
                />
              </svg>
            </a>
          </div>

          <div className="w-full md:w-[43%] mt- md:mt-0 md:ml-4">
            <img
              src="../../src/assets/img/doctor.png"
              alt="Doctor Holding Pills"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
