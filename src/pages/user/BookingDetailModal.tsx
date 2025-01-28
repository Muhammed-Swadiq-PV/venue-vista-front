import React from 'react';
import { XIcon } from 'lucide-react'; 

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/3 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
