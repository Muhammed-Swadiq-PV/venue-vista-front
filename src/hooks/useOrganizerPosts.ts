
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useOrganizerPosts = () => {
  const [hasPosted, setHasPosted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(''); 
        if (response.data && response.data.length > 0) {
          setHasPosted(true);
        }
      } catch (error) {
        console.error('Failed to fetch organizer posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { hasPosted, loading };
};
