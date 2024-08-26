import React from 'react';

interface EventDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  eventDetails: {
    title: string;
    start: Date;
    end: Date;
    type: 'day' | 'night' | 'full';
    details?: string;
  };
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onRequestClose, eventDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <p><strong>Date:</strong> {new Date(eventDetails.start).toLocaleDateString()}</p>
        <p><strong>Type:</strong> {eventDetails.type}</p>
        {eventDetails.details && <p><strong>Details:</strong> {eventDetails.details}</p>}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onRequestClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal;
