import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';
import Header from '../../components/admin/Header';
import Footer from '../../components/admin/Footer';
import Modal from 'react-modal';
import { AiOutlineClose } from 'react-icons/ai';

interface Organizer {
  _id: string;
  name: string;
  eventHallName: string;
  isProfileUpdated: boolean;
  isProfileVerified: boolean;
  buildingFloor?: string;
  city?: string;
  district?: string;
  eventHallLicenseUrl?: string;
  ownerIdCardUrl?: string;
  phoneNumber?: string;
  pincode?: string;
}

Modal.setAppElement('#root'); // Ensure accessibility

const Notifications: React.FC = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null); 
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axiosInstance.get('/admin/pending-requests');
        const filteredOrganizers = response.data.filter((organizer: Organizer) =>
          organizer.isProfileUpdated && !organizer.isProfileVerified
        );
        setOrganizers(filteredOrganizers);
      } catch (error) {
        console.error('Failed to fetch organizers', error);
      }
    };

    fetchOrganizers();
  }, []);

  const handleViewDetails = async (organizerId: string) => {
    try {
      const response = await axiosInstance.get(`/admin/pending-request/${organizerId}`);
      setSelectedOrganizer(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch organizer details', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrganizer(null);
  };

  const handleApprove = () => {
    // Handle approval logic
    console.log('Organizer approved');
    closeModal(); // Close modal after action
  };

  const handleDisapprove = () => {
    // Handle disapproval logic
    console.log('Organizer disapproved');
    closeModal(); // Close modal after action
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8 shadow-md rounded-md mx-4 md:mx-8">
        <h1 className="text-xl text-center font-bold mb-4">Organizers Pending Verification</h1>
        {organizers.length === 0 ? (
          <p>No organizers pending verification</p>
        ) : (
          <ul>
            {organizers.map((organizer) => (
              <li key={organizer._id} className="my-5 p-4 bg-gray-50 rounded-md shadow-md">
                <div className="flex justify-between items-center">
                  <span>{organizer.name}</span>
                  <button
                    onClick={() => handleViewDetails(organizer._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />

      {/* Modal for displaying organizer details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Organizer Details"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto my-10"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Organizer Details</h2>
        {selectedOrganizer ? (
          <div>
            <p><strong>Name:</strong> {selectedOrganizer.name}</p>
            <p><strong>Building Floor:</strong> {selectedOrganizer.buildingFloor}</p>
            <p><strong>City:</strong> {selectedOrganizer.city}</p>
            <p><strong>District:</strong> {selectedOrganizer.district}</p>
            <p><strong>Event Hall License URL:</strong> <a href={selectedOrganizer.eventHallLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View License</a></p>
            <p><strong>Event Hall Name:</strong> {selectedOrganizer.eventHallName}</p>
            <p><strong>Owner ID Card URL:</strong> <a href={selectedOrganizer.ownerIdCardUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View ID Card</a></p>
            <p><strong>Phone Number:</strong> {selectedOrganizer.phoneNumber}</p>
            <p><strong>Pincode:</strong> {selectedOrganizer.pincode}</p>
          </div>
        ) : (
          <p>Loading details...</p>
        )}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleApprove}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={handleDisapprove}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Disapprove
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;
