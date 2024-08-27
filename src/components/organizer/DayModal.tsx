import React, { useState } from "react";
import ReactModal from "react-modal";
import { HiX } from "react-icons/hi";

interface DayModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  day: string;
  prices: { dayPrice: number; nightPrice: number; fullDayPrice: number };
  onSavePrices: (day: string, prices: { dayPrice: number; nightPrice: number; fullDayPrice: number }) => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, onRequestClose, day, prices, onSavePrices }) => {
  const [localPrices, setLocalPrices] = useState(prices);

  const handleChange = (priceType: 'dayPrice' | 'nightPrice' | 'fullDayPrice', value: number) => {
    setLocalPrices(prev => ({ ...prev, [priceType]: value }));
  };

  const handleSave = () => {
    onSavePrices(day, localPrices);
    onRequestClose();
  };

  return (
    <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    className="bg-white rounded-lg w-full max-w-md p-6 relative mt-20"
    style={{
      overlay: {
        zIndex: 1000,
        overflow: 'hidden'
      },
      content: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
      },
    }}
  >
    <button
      onClick={onRequestClose}
      className="absolute top-2 right-2 p-1"
      aria-label="Close"
    >
      <HiX className="h-6 w-6 text-gray-500 hover:text-gray-700" />
    </button>
    <h2 className="text-xl font-bold mb-4 mt-8">{day} Prices</h2>
    <div className="mb-4">
      <label className="block text-sm mb-1">Day Price</label>
      <input
        type="number"
        value={localPrices.dayPrice}
        onChange={(e) => handleChange('dayPrice', Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm mb-1">Night Price</label>
      <input
        type="number"
        value={localPrices.nightPrice}
        onChange={(e) => handleChange('nightPrice', Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm mb-1">Full Day Price</label>
      <input
        type="number"
        value={localPrices.fullDayPrice}
        onChange={(e) => handleChange('fullDayPrice', Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="flex justify-center">
      <button
        className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  </ReactModal>
  );
};

export default DayModal;
