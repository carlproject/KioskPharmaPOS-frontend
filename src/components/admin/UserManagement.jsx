import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "All") {
      setFilteredUsers(users);
    } else {
      const isGoogleAccount = selectedFilter === "Google";
      setFilteredUsers(users.filter(user => Boolean(user.displayName) === isGoogleAccount));
    }
    setCurrentPage(1);
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const nameA = (a.displayName || `${a.FirstName} ${a.LastName}`).toLowerCase();
      const nameB = (b.displayName || `${b.FirstName} ${b.LastName}`).toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setFilteredUsers(sortedUsers);
    setSortAsc(!sortAsc);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:ml-64 min-h-screen bg-gray-50">
      <div className="p-6 border-2 border-gray-200 rounded-xl dark:border-gray-700 mt-14 bg-white shadow-lg transition duration-300 ease-in-out hover:shadow-2xl">
        <section className="py-6">
          <h1 className="text-3xl font-bold text-green-500 mb-6">User Management</h1>
          <p className="text-gray-600 text-lg mb-4">
            Manage users by viewing their details and account type below.
          </p>
          <div className="flex justify-between items-center mb-4">
            <div>
              <label htmlFor="filter" className="mr-2 text-gray-700">Filter by Account Type:</label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="px-3 py-1 border rounded-lg focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Google">Google Account</option>
                <option value="Manual">Manual Account</option>
              </select>
            </div>
            <button
              onClick={handleSort}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-150"
            >
              Sort by Name {sortAsc ? "↑" : "↓"}
            </button>
          </div>
          <table className="w-full table-auto border-collapse bg-green-50 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="px-4 py-2">Photo</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Account Type</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-600 py-4">No users found.</td>
                </tr>
              ) : (
                currentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-green-100 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={user.photoURL || "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d1429654-7460-4219-b126-9d445bf52684/dghfe0c-6d453123-3a63-47d6-9001-eb09bb833ffe.jpg/v1/fill/w_1280,h_1670,q_75,strp/default_cute_tiny_hyperrealistic_anime_wolf_made_o_by_paulosc_yumisilva_dghfe0c-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTY3MCIsInBhdGgiOiJcL2ZcL2QxNDI5NjU0LTc0NjAtNDIxOS1iMTI2LTlkNDQ1YmY1MjY4NFwvZGdoZmUwYy02ZDQ1MzEyMy0zYTYzLTQ3ZDYtOTAwMS1lYjA5YmI4MzNmZmUuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.rqoc5_RKhJAo34sAGz64YUwOplXb0RgN8zfNDPGKAfc"}
                        alt={user.displayName || `${user.FirstName} ${user.LastName}`}
                        className="w-16 h-16 rounded-full border-2 border-green-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      {user.displayName || `${user.FirstName} ${user.LastName}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {user.displayName ? "Google Account" : "Manual Account"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserManagement;
