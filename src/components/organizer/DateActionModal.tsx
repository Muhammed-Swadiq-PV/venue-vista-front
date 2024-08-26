import React from 'react';

interface DateActionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    selectedDate: Date;
    onEditPrice: () => void;
    onViewBookingDetails: () => void;
    isPriceSet: boolean;
    isBooked: boolean;
}

const DateActionModal: React.FC<DateActionModalProps> = ({
    isOpen,
    onRequestClose,
    selectedDate,
    onEditPrice,
    onViewBookingDetails,
    isPriceSet,
    isBooked,
}) => {
    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">
                    Actions for {selectedDate.toLocaleDateString()}
                </h2>

                <div className="mb-4">
                    {isBooked ? (
                        <button
                            onClick={onViewBookingDetails}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            View Booking Details
                        </button>
                    ) : isPriceSet ? (
                        <button
                            onClick={onEditPrice}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Edit Price
                        </button>
                    ) : (
                        <button
                            onClick={onEditPrice}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Add Price
                        </button>
                    )}
                </div>

                <button
                    onClick={onRequestClose}
                    className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                    Cancel
                </button>
            </div>
        </div>
    ) : null;
};

export default DateActionModal;
