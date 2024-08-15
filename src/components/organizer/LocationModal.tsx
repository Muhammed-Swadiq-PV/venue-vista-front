import React, { useState } from 'react';
import { LatLng } from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationPicker from './LocationPicker';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: LatLng) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);

  const handleSave = () => {
    if (markerPosition) {
      onSave(markerPosition);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4">
        <h2 className="text-xl font-bold mb-4">Select Venue Location</h2>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={[10.8505, 76.2711]} // Center of Kerala
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker setMarkerPosition={setMarkerPosition} />
            {markerPosition && <Marker position={markerPosition} />}
          </MapContainer>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
