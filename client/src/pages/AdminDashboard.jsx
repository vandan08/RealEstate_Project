import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalUsers, fetchTotalListings } from '../redux/admin/adminSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { totalUsers, totalListings } = useSelector((state) => state.admin);
  const [users, setUsers] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    dispatch(fetchTotalUsers());
    dispatch(fetchTotalListings());
  }, [dispatch]);

  const handleTotalUsersClick = async () => {
    if (showUserList) {
      setShowUserList(false);
      return;
    }
    setIsFetchingUsers(true);
    try {
      const response = await fetch('/api/admin/users-with-listings');
      const data = await response.json();
      const formattedUsers = data.listings.map((listing) => ({
        name: listing.userRef,
        listings: listing.name, // Assuming the listing name is stored in the 'name' field
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users with listings:', error);
    } finally {
      setIsFetchingUsers(false);
      setShowUserList(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome Admin!</h1>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={() => { /* Handle sign out */ }}
        >
          Sign Out
        </button>
      </div>
      <div className="mt-6 flex flex-col space-y-2">
        <div
          className="bg-gray-200 p-4 rounded-md shadow-md w-96 cursor-pointer"
          onClick={handleTotalUsersClick}
        >
          <p className="text-lg font-semibold">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div
          className="bg-gray-200 p-4 rounded-md shadow-md w-96 cursor-pointer"
          onClick={handleTotalUsersClick}
        >
          <p className="text-lg font-semibold">Total Listings</p>
          <p className="text-2xl font-bold">{totalListings}</p>
        </div>
      </div>
      {showUserList && (
        <div className="overflow-y-auto h-96 w-96 mt-6">
          {isFetchingUsers && <p>Loading users...</p>}
          {users && users.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">All Users and Listings</h2>
              {users.map((user, index) => (
                <div key={index} className="border p-4 mb-4 rounded-md shadow-md w-96">
                  <p className="text-lg font-semibold">User:{user.name}</p>
                  <p className="text-lg font-semibold">Listings: {user.listings}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
