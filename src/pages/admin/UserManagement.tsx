// src/pages/admin/UserManagement.tsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';
import { User } from '../../types/User'
import ErrorBoundary from '../../components/ErrorBoundary';  

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');

        // for making key as unique I am converting mongo db _id into id 
        const usersWithIdAsString = response.data.map((user: any) => ({
            id: user._id.toString(), // Convert ObjectId to string
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
          }));

        setUsers(usersWithIdAsString);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}`, {
        isBlocked: !currentStatus,
      });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, isBlocked: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow">
          <SideMenu />
          <main className="flex-grow p-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          className={`px-4 py-2 text-white ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} rounded`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default UserManagement;
