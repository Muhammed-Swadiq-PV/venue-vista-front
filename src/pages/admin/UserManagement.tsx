import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';
import { User } from '../../types/User';
import ErrorBoundary from '../../components/ErrorBoundary';
import ReactModal from 'react-modal';
import Pagination from '../../components/Pagination';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users', {
          params: { page: currentPage, limit: ITEMS_PER_PAGE }
        });
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
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

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    const userId = selectedUser.id;
    const currentStatus = selectedUser.isBlocked;

    try {
      setDisabledButtons(prevState => ({ ...prevState, [userId]: true }));
      await axiosInstance.patch(`/admin/users/${userId}`, {
        isBlocked: !currentStatus,
      });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, isBlocked: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setDisabledButtons(prevState => ({ ...prevState, [userId]: false }));
      closeModal();
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-grow">
          <SideMenu />
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Action"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
              <p className="mb-6">Are you sure you want to {selectedUser?.isBlocked ? 'unblock' : 'block'} this user?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleConfirmAction}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </ReactModal>

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
                            onClick={() => openModal(user)}
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

                <div className='flex justify-center mt-4'>
                <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                />
                </div>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default UserManagement;
