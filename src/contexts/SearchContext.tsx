import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CombinedEventHallData } from '../pages/user/U-Home';

interface SearchContextProps {
  combinedEventHallData: CombinedEventHallData[];
  filteredEventHallData: CombinedEventHallData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCombinedEventHallData: (data: CombinedEventHallData[]) => void;
  setFilteredEventHallData: (data: CombinedEventHallData[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [combinedEventHallData, setCombinedEventHallData] = useState<CombinedEventHallData[]>([]);
  const [filteredEventHallData, setFilteredEventHallData] = useState<CombinedEventHallData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <SearchContext.Provider
      value={{
        combinedEventHallData,
        filteredEventHallData,
        searchTerm,
        setSearchTerm,
        setCombinedEventHallData,
        setFilteredEventHallData,
        currentPage, 
        setCurrentPage
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
