import React from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedDate: Date;
  availability: string[];
  onBook: (type: 'day' | 'night' | 'full') => void;
  organizerId: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onRequestClose,
  selectedDate,
  availability,
  onBook,
  organizerId,
}) => {

  const navigate = useNavigate();
  const handleBook = (type: 'day' | 'night' | 'full') => {
    onBook(type);
    navigate('/user/book-event-hall/confirm', {
      state:{
        bookingType: type,
        selectedDate,
        organizerId,
      }
    });
  }

  const isDayBooked = availability.includes('Day');
  const isNightBooked = availability.includes('Night');
  const isFullDayBooked = availability.includes('Full Day');

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Modal"
      ariaHideApp={false}
      className="relative p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-16"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <FaTimes className="h-6 w-6" />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Booking for {selectedDate.toDateString()}
      </h2>

      {isFullDayBooked ? (
        <p className="text-lg mb-6 text-center">This date is already fully booked. Please select another date.</p>
      ) : (
        <>
          <p className="text-lg mb-6 text-center">{availability.join(', ')}</p>
          <div className="flex justify-around">
            {!isDayBooked && (
              <button
                className={`px-4 py-2 rounded ${isNightBooked ? 'bg-blue-300' : 'bg-blue-500 text-white'}`}
                onClick={() => handleBook('day')}
                disabled={isNightBooked}
                aria-disabled={isNightBooked}
                title={isNightBooked ? 'Night booking is unavailable' : ''}
              >
                Book Day
              </button>
            )}
            {!isNightBooked && (
              <button
                className={`px-4 py-2 rounded ${isDayBooked ? 'bg-yellow-300' : 'bg-yellow-500 text-white'}`}
                onClick={() => handleBook('night')}
                disabled={isDayBooked}
                aria-disabled={isDayBooked}
                title={isDayBooked ? 'Day booking is unavailable' : ''}
              >
                Book Night
              </button>
            )}
            {!isDayBooked && !isNightBooked && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handleBook('full')}
              >
                Book Full Day
              </button>
            )}
          </div>
        </>
      )}
    </ReactModal>
  );
};

export default BookingModal;
