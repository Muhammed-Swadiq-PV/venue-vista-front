import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';
import { Organizer } from '../../types/Organize';
import ErrorBoundary from '../../components/ErrorBoundary'; 

const OrganizerManagement: React.FC = () => {
  const [users, setUsers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/organizer');
        const usersWithIdAsString = response.data.map((user: any) => ({
          id: user._id.toString(),
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

  //disabling button between req, res of current task through useState hook
  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      setDisabledButtons(prevState => ({ ...prevState, [userId]: true }));
      await axiosInstance.patch(`/admin/organizer/${userId}`, {
        isBlocked: !currentStatus,
      });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, isBlocked: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setDisabledButtons(prevState => ({ ...prevState, [userId]: false }));
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow">
          <SideMenu />
          <main className="flex-grow p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className='overflow-x-auto'>
                <table className="min-w-full table-auto">
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
                            className={`px-2 py-1 sm:px-4 sm:py-2 text-white ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} rounded`}
                            disabled={disabledButtons[user.id] || false}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default OrganizerManagement;
