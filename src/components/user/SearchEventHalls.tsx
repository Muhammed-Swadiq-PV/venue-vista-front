import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import { FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';
import { useSearchContext, EventHallAndOrganizerArray } from '../../contexts/SearchContext';

const fetchEventHallData = async (searchTerm: string): Promise<EventHallAndOrganizerArray> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/event-halls`, {
      params: { search: searchTerm }
    });
    console.log('response: ',response)
    console.log(Array.isArray(response.data), 'response type')
    return response.data;
  } catch (error) {
    console.error('Error fetching event hall data:', error);
    return [];
  }
};

const SearchEventHalls: React.FC = () => {
  const { searchTerm, setSearchTerm, combinedData, setCombinedData } = useSearchContext();

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim()) {
        const data = await fetchEventHallData(term);
      setCombinedData(data);
      }
    }, 300),
    [setCombinedData]
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }
    // Cleanup the debounce effect on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative max-w-md mx-auto ">
      <label htmlFor="search-input" className="sr-only">Search event halls</label>
      <input
        id="search-input"
        type="text"
        placeholder="Search event halls..."
        value={searchTerm}
        onChange={handleInputChange}
        className="px-4 py-2 rounded-md border  border-gray-300 w-full sm:max-w-xs md:max-w-sm lg:max-w-md"
        aria-label="Search event halls"
      />
       <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <FaSearch className=" text-gray-500 w-5 h-5" aria-hidden="true" />
      </div>
    </div>
  );
};

export default SearchEventHalls;
  
  