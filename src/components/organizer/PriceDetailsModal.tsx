import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import { Prices } from '../../types/prices';
import Cookies from 'js-cookie';

interface PriceDetailsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    selectedDate: Date;
    onSavePrices: (prices: { dayPrice: number; nightPrice: number; fullDayPrice: number }) => void;
    initialPrices: Prices;
    bookings?: Array<{ type: 'day' | 'night' | 'full'; price: number }>; 
}

const PriceDetailsModal: React.FC<PriceDetailsModalProps> = ({
    isOpen,
    onRequestClose,
    selectedDate,
    onSavePrices,
    initialPrices,
    bookings = [],
}) => {
    const organizerId = Cookies.get('OrganizerId');


    // Initialize state with default values if not provided
    const [dayPrice, setDayPrice] = useState<number | ''>(initialPrices.dayPrice || '' );
    const [nightPrice, setNightPrice] = useState<number | ''>(initialPrices.nightPrice || '' );
    const [fullDayPrice, setFullDayPrice] = useState<number | ''>(initialPrices.fullDayPrice || '' );
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setDayPrice(initialPrices.dayPrice || '');
        setNightPrice(initialPrices.nightPrice || '');
        setFullDayPrice(initialPrices.fullDayPrice || '');
    }, [initialPrices]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const prices = {
                dayPrice: dayPrice as number,
                nightPrice: nightPrice as number,
                fullDayPrice: fullDayPrice as number,
            };
            await axios.post(`${API_BASE_URL}/organizer/events/prices`, {
                date: selectedDate.toISOString(),
                organizerId: organizerId,
                dayPrice: dayPrice,
                nightPrice: nightPrice,
                fullDayPrice: fullDayPrice,
            });
            onSavePrices(prices);
            onRequestClose();
        } catch (error) {
            console.error('Error saving prices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderBookings = () => {
        if (bookings.length === 0) {
            return <p>No existing bookings for this date.</p>;
        }

        return bookings.map((booking, index) => (
            <div key={index} className="mb-2">
                <p><strong>Type:</strong> {booking.type}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
            </div>
        ));
    };

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">Set Prices for {selectedDate.toLocaleDateString()}</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Day Price</label>
                    <input
                        type="number"
                        value={dayPrice}
                        onChange={(e) => setDayPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                         placeholder="Enter day price"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Night Price</label>
                    <input
                        type="number"
                        value={nightPrice}
                        onChange={(e) => setNightPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter night price"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Full Day Price</label>
                    <input
                        type="number"
                        value={fullDayPrice}
                        onChange={(e) => setFullDayPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                         placeholder="Enter full day price"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Existing Bookings</h3>
                    {renderBookings()}
                </div>

                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                        onClick={onRequestClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleSave}
                        disabled={(!dayPrice && !nightPrice && !fullDayPrice) || isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default PriceDetailsModal;
