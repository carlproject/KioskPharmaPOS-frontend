import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs'

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      await addDoc(collection(db, 'users'), {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        username: formData.username,
        password: hashedPassword
      });
      setIsSuccessModalOpen(true);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <section className="bg-gray-50 :bg-gray-50">
  <div className="flex flex-col items-center justify-center px-4 py-6 mx-auto md:h-screen lg:py-0">
    <div className="w-full bg-white rounded-lg shadow :border sm:max-w-sm md:mt-0 :bg-gray-800 :border-gray-700">
      <div className="p-4 space-y-4 md:space-y-4 sm:p-6">
        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl :text-white">
          Create an account
        </h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-900 :text-white">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 :bg-gray-700 :border-gray-600 :text-white"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-900 :text-white">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 :bg-gray-700 :border-gray-600 :text-white"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-900 :text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 :bg-gray-700 :border-gray-600 :text-white"
              placeholder="username123"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900 :text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 :bg-gray-700 :border-gray-600 :text-white"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900 :text-white">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 :bg-gray-700 :border-gray-600 :text-white"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 :bg-gray-700 :border-gray-600"
                required
              />
            </div>
            <div className="ml-2 text-xs">
              <label htmlFor="terms" className="font-light text-gray-500 :text-gray-300">
                I accept the{' '}
                <a href="#" className="font-medium text-primary-600 hover:underline :text-primary-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 :bg-blue-600 :hover:bg-blue-700 :focus:ring-blue-800"
          >
            Create an account
          </button>
          <p className="text-xs font-light text-gray-500 :text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary-600 hover:underline :text-primary-500">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  </div>
  {isSuccessModalOpen && (
  <div
    id="successModal"
    tabIndex="-1"
    aria-hidden="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
      <div className="relative p-4 text-center bg-white rounded-lg shadow :bg-gray-800 sm:p-5">
        <button
          type="button"
          onClick={() => setIsSuccessModalOpen(false)}
          className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center :hover:bg-gray-600 :hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="w-12 h-12 rounded-full bg-green-100 :bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-green-500 :text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Success</span>
        </div>
        <p className="mb-4 text-lg font-semibold text-gray-900 :text-white">
          Account created successfully!
        </p>
      </div>
    </div>
  </div>
)}
</section>

  );
}

export default RegisterPage;


