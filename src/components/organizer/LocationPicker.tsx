import React from 'react';
import { LatLng } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

interface LocationPickerProps {
  setMarkerPosition: (position: LatLng) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ setMarkerPosition }) => {
  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
    },
  });
  return null;
};

export default LocationPicker;
