import React, {useState} from 'react';
import { toast } from 'react-toastify';

interface CancellationModalProps {
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: ( reason: string ) => void; 
}

const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if(!reason){
        toast.error('please provide a reason for cancellation');
        return
    }
    onConfirm(reason)
    setReason('');
  }

  const handleClose = () => {
    setReason(''); 
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
        <p className="mb-6">Are you sure you want to cancel this booking? Please provide a reason for cancellation.</p>

        {/* Input field for the cancellation reason */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for cancellation..."
          rows={4}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            No, Go Back
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
