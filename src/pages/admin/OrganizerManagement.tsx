import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import SideMenu from '../../components/admin/SideMenu';
import { Organizer } from '../../types/Organize';
import ErrorBoundary from '../../components/ErrorBoundary';
import ReactModal from 'react-modal';
import Pagination from '../../components/Pagination';

const OrganizerManagement: React.FC = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;


  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axiosInstance.get('/admin/organizer', {
          params: { page: currentPage, limit: ITEMS_PER_PAGE }
        });
        setOrganizers(response.data.organizers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching organizers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, [currentPage]);



  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axiosInstance.get('/admin/organizer');
        const organizersWithIdAsString = response.data.map((organizer: any) => ({
          id: organizer._id.toString(),
          name: organizer.name,
          email: organizer.email,
          isVerified: organizer.isVerified,
          isBlocked: organizer.isBlocked,
        }));
        setOrganizers(organizersWithIdAsString);
      } catch (error) {
        console.error('Error fetching organizers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, []);

  const openModal = (organizer: Organizer) => {
    setSelectedOrganizer(organizer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrganizer(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrganizer) return;

    const organizerId = selectedOrganizer.id;
    const currentStatus = selectedOrganizer.isBlocked;

    try {
      setDisabledButtons(prevState => ({ ...prevState, [organizerId]: true }));
      await axiosInstance.patch(`/admin/organizer/${organizerId}`, {
        isBlocked: !currentStatus,
      });
      setOrganizers(organizers.map(organizer =>
        organizer.id === organizerId ? { ...organizer, isBlocked: !currentStatus } : organizer
      ));
    } catch (error) {
      console.error('Error updating organizer status:', error);
    } finally {
      setDisabledButtons(prevState => ({ ...prevState, [organizerId]: false }));
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
              <p className="mb-6">Are you sure you want to {selectedOrganizer?.isBlocked ? 'unblock' : 'block'} this organizer?</p>
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
                    {organizers.map((organizer) => (
                      <tr key={organizer.id}>
                        <td className="border px-4 py-2">{organizer.name}</td>
                        <td className="border px-4 py-2">{organizer.email}</td>
                        <td className="border px-4 py-2">
                          {organizer.isBlocked ? 'Blocked' : 'Active'}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => openModal(organizer)}
                            className={`px-2 py-1 sm:px-4 sm:py-2 text-white ${organizer.isBlocked ? 'bg-green-500' : 'bg-red-500'} rounded`}
                            disabled={disabledButtons[organizer.id] || false}
                          >
                            {organizer.isBlocked ? 'Unblock' : 'Block'}
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

export default OrganizerManagement;
