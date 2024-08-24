import React, { useState } from 'react';
import Header from '../organizer/Header';
import Footer from '../organizer/Footer';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';

const CancellationPolicy: React.FC = () => {
  const [policy, setPolicy] = useState('');

  const organizerId = Cookies.get('OrganizerId');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/organizer/cancellation-policy`, {
        policy: policy,
        organizerId: organizerId,
      });
      console.log('Cancellation policy saved successfully', response.data);
    } catch (error) {
      console.error('Error posting cancellation policy data', error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-2xl mx-auto p-4">
            <h1 className="flex items-center justify-center text-2xl font-bold mb-4">
              Cancellation Policy
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <div className="mb-4 w-full">
                <label htmlFor="policy" className="block mb-2 font-semibold text-red-500">
                  Please provide your cancellation policy. This information is crucial for guests to
                  understand the terms and conditions for cancellations. Ensure that your policy is clear
                  and precise to avoid any misunderstandings.
                </label>
                <textarea
                  id="policy"
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={10}
                  placeholder="Enter your cancellation policy..."
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CancellationPolicy;
