import React, { useState, useEffect } from 'react';
import Header from '../../components/auth/Header';
import Footer from '../../components/auth/Footer';
import { useHandleSignOut } from '../../components/auth/SignOut';
import ErrorBoundary from '../../components/ErrorBoundary';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import Spinner from '../../components/Spinner';

interface Post {
  main: {
    images: string[];
    description: string;
  };
}

const UHome: React.FC = () => {
  const handleSignOut = useHandleSignOut();
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/latest`);
        setLatestPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching latest post:', err);
        setError('Failed to load the latest post. Please try again later.');
        setLoading(false);
      }
    };

    fetchLatestPost();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSignOut={handleSignOut} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <ErrorBoundary>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner text="Loading..." />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : latestPost ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Latest Venue</h1>
              {latestPost.main.images.length > 0 && (
                <img 
                  src={latestPost.main.images[0]} 
                  alt="Latest Venue" 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700">{latestPost.main.description}</p>
            </div>
          ) : (
            <div className="text-center">No posts available.</div>
          )}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default UHome;