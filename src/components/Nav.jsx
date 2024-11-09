import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Logo from '../assets/img/logo.png'
import { auth } from '../config/firebase';
import { getAuth, signOut } from 'firebase/auth';

function Nav() {

  const handLogout = async() => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null)
      alert("User signed out successfully.");
    } catch (error) {
      console.log("Error signing out", error);
    }
  }
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
 const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const localStorageUser = JSON.parse(localStorage.getItem('user'));
        setUser(localStorageUser || {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
      } else {
        const localStorageUser = JSON.parse(localStorage.getItem('user'));
        setUser(localStorageUser);
      }
    });
    return () => unsubscribe();
  }, []);
  

  const location = useLocation();
  return (
    <nav className="bg-white dark:bg-gray-900 dark:border-blue-500 border-b-2" style={{ borderColor: '#28A745' }}>
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src={Logo} className="h-8" alt="Checacio's Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white" style={{ fontFamily: 'cursive' }}>
          Checacio
      </span>
      </a>
      <div className="flex md:order-2 gap-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
       {user ? (
        <div>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 bg-gray-800 rounded-full text-white focus:outline-none"
        >
          <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="User" />
          <span>{user.displayName || 'User'}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-30 mt-2 mr-2 w-48 bg-white rounded-lg shadow-lg border dark:bg-gray-800">
            <div className="p-4 text-sm text-gray-700 dark:text-gray-300 border-b">
              <p>{user.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a href="/user/order-history" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Prescription History</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
              </li>
              <li>
                <button onClick={handLogout} className="block text-start w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Sign Out</button>
              </li>
            </ul>
          </div>
        )}
      </div>
      ) : (
        <div className='flex flex-row gap-2'>
          <a
            href="/register"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get started
          </a>
          <a
            href="/login"
            className="text-white border-blue-600 bg-transparent hover:border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:hover:border-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </a>
        </div>
      )}
        <button
          data-collapse-toggle="navbar-cta"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-cta"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
      <ul className="flex flex-col gap-3 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <Link
          to="/"
          className={`block py-2 px-3 md:p-0 rounded ${
            location.pathname === '/' 
              ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' 
              : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/meet-the-team"
          className={`block py-2 px-3 md:p-0 rounded ${
            location.pathname === '/meet-the-team'
              ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
              : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
        >
          About
        </Link>
      </li>
      <li>
        <button
          id="mega-menu-full-dropdown-button"
          data-collapse-toggle="mega-menu-full-dropdown"
          className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
        >
            Services
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
      </li>
      <li>
        <Link
          to="/contact-us"
          className={`block py-2 px-3 md:p-0 rounded ${
            location.pathname === '/contact-us'
              ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
              : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
        >
          Contact
        </Link>
      </li>
    </ul>
      </div>
    </div>

    <div id="mega-menu-full-dropdown" class="mt-1 hidden absolute left-[23%] z-20 rounded-md py-12 px-4 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y dark:bg-gray-800 dark:border-gray-600">
        <div class="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 dark:text-white sm:grid-cols-2 md:px-6">
            <ul>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Prescription Management</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Over-the-Counter Sales</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Product Catalog</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Order Tracking</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Payment Processing</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div class="font-semibold">Customer Support</div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">Connect with third-party tools that you're already using.</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
  </nav>
  
  )
}

export default Nav