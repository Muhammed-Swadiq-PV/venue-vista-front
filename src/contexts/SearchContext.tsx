import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface EventHall {
  _id: string;
  organizerId: string;
  main: {
    images: string[];
    description: string;
  };
  parking: {
    images: string[];
    description: string;
  };
  indoor: {
    images: string[];
    description: string;
  };
  stage: {
    images: string[];
    description: string;
  };
  dining: {
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
  buildingFloor: string;
  city: string;
  district: string;
}

// export interface CombinedEventHallData {
//   eventHalls: EventHall[];
//   organizers: Organizer[];
// }

export type EventHallAndOrganizerArray = [EventHall, Organizer][];

 export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  combinedData: EventHallAndOrganizerArray;
  setCombinedData: React.Dispatch<React.SetStateAction<EventHallAndOrganizerArray>>;
}


// Create the context with the correct type
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [combinedData, setCombinedData] = useState<EventHallAndOrganizerArray>([]);

  // console.log(combinedData, 'combine data in context')
  // console.log(combinedData.length, 'combine data length in context')
  // combinedData.map((item, index) => {
  //   const eventHall = item[0]
  //   const organizer = item[1]
  //   console.log('=============', eventHall,'-------===', organizer )
  // })


  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        combinedData,
        setCombinedData,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
