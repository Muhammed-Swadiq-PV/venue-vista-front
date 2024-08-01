import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInterceptor';

const Notifications: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axiosInstance.get('/admin/pending-requests'); // Adjust the endpoint as needed
        setPendingRequests(response.data.requests);
      } catch (error) {
        console.error('Failed to fetch pending requests', error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await axiosInstance.patch(`/admin/accept-request/${requestId}`);
      setPendingRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Failed to accept request', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axiosInstance.patch(`/admin/reject-request/${requestId}`); 
      setPendingRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Failed to reject request', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pending Requests</h1>
      {pendingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{request.description}</span>
                <div>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
