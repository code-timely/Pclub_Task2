import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlusIcon } from '../../components/UserPlusIcon';
import { LogOutIcon } from '../../components/LogOutIcon';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/admin/getUsers', { withCredentials: true })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          setError('Your session has expired, please log in again.');
        } else {
          console.error('Error fetching users:', error);
        }
      });
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:3000/api/v1/admin/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('/admin/login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Admin Access</h1>
        <div className='flex justify-end'>
          <button
            className="bg-black text-white border border-white px-4 py-2 rounded mr-2 flex items-center transition-transform transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/admin/register_user')}
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Register User
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 mx-3 rounded flex items-center transition-transform transform hover:scale-105 hover:shadow-lg"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5 mr-2" />
            Log Out
          </button>
        </div>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map(user => (
            <Link
              key={user._id}
              to="/admin/user_attendance"
              state={{ userID: user._id }}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer transform hover:scale-105 hover:shadow-lg transition-transform duration-200"
            >
              <img src={user.keyImage} alt={user.name} className="w-50 h-50 object-cover rounded-t-lg" />
              <div className="mt-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;