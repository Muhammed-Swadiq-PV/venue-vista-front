import React, { useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';
import { useSearchContext } from '../../contexts/SearchContext';

const SearchEventHalls: React.FC = () => {
    const { searchTerm, setSearchTerm, combinedEventHallData, setFilteredEventHallData, setCurrentPage  } = useSearchContext();
  
    const debouncedSearch = useCallback(
      debounce((term: string) => {
        const filtered = combinedEventHallData.filter((item) =>
          item.organizer.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredEventHallData(filtered);
        setCurrentPage(1);
      }, 300),
      [combinedEventHallData, setFilteredEventHallData, setCurrentPage]
    );
  
    useEffect(() => {
      debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        setFilteredEventHallData(combinedEventHallData);
      }, [combinedEventHallData, setFilteredEventHallData]);
  
    return (
      <div className="relative max-w-md mx-auto">
        <label htmlFor="search-input" className="sr-only">Search event halls</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search event halls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 w-full sm:max-w-xs md:max-w-sm lg:max-w-md"
          aria-label="Search event halls"
        />
        <FaSearch className="flex items-center absolute  top-2 right-3 text-gray-500" aria-hidden="true" />
      </div>
    );
  };
  
  export default SearchEventHalls;
  
  