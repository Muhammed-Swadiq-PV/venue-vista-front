import React, { useState } from 'react';
import Header from '../organizer/Header';
import Footer from '../organizer/Footer';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';

const RulesAndRestrictions: React.FC = () => {
  const [rules, setRules] = useState('');

  const organizerId = Cookies.get('OrganizerId');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/organizer/rules-and-restrictions`, {
            rules: rules,
            organizerId: organizerId,
        });
    } catch (error) {
        console.log('error posting data');
    }
  };

  return (
    <>
    <Header/>
    <div className="flex flex-col min-h-screen">
    <div className="flex-grow flex items-center justify-center">
    <div className="max-w-2xl mx-auto p-4">
      <h1 className=" flex items-center justify-center text-2xl font-bold mb-4">Rules & Restrictions</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <div className="mb-4 w-full">
          <label htmlFor="rules" className="block mb-2 font-semibold text-red-500">Please add the rules and restrictions that apply to your event hall. This information will help your guests understand the guidelines they need to follow while using the venue. Ensure that your rules are clear and specific to avoid any misunderstandings. </label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full p-2 border rounded"
            rows={10}
            placeholder="Enter rules and restrictions for your hall..."
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>
    </div>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default RulesAndRestrictions;
