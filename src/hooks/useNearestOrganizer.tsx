import React, { createContext, useState, ReactNode , useContext} from 'react';

// Define EventHall and Organizer types
interface EventHall {
  _id: string;
  organizerId: string;
  main: {
    images: string[];
    description: string;
  };
  dining: {
    images: string[];
    description: string;
  };
  indoor: {
    images: string[];
    description: string;
  };
  parking: {
    images: string[];
    description: string;
  };
  stage: {
    images: string[];
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Organizer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  district: string;
  city: string;
  buildingFloor: string;
}

// Define the combined type for context data
interface DetailedOrganizer {
  eventHalls: EventHall[];
  organizers: Organizer[];
}

// Define the context type
export interface OrganizerContextType {
  detailedOrganizers: DetailedOrganizer[];
  setDetailedOrganizers: React.Dispatch<React.SetStateAction<DetailedOrganizer[]>>;
  viewingNearby: boolean;
  setViewingNearby: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default value as undefined
export const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

export const OrganizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [detailedOrganizers, setDetailedOrganizers] = useState<any[]>([]);
  const [viewingNearby, setViewingNearby] = useState<boolean>(false);

  return (
    <OrganizerContext.Provider value={{ detailedOrganizers, setDetailedOrganizers, viewingNearby, setViewingNearby }}>
      {children}
    </OrganizerContext.Provider>
  );
};

export const useOrganizerContext = () => {
  const context = useContext(OrganizerContext);
  if (context === undefined) {
    throw new Error('OrganizerContext must be used within an OrganizerProvider');
  }
  return context;
};
