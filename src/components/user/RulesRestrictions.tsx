import React, { useState, useEffect } from 'react';
import Header from '../organizer/Header';
import Footer from '../organizer/Footer';
import Spinner from '../Spinner';
import axiosInstance from '../../axios/axiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';

const RulesAndRestrictions: React.FC = () => {
    const [rules, setRules] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDataSaved, setIsDataSaved] = useState(false);


    const organizerId = Cookies.get('OrganizerId');

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/organizer/rules-and-restrictions`, {
                    params: { organizerId }
                });
                if (response.data && response.data.rules) {
                    setRules(response.data.rules);
                    setIsDataSaved(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rules:', error);
                setError('Failed to load rules.');
                setLoading(false);
            }
        };

        fetchRules();
    }, [organizerId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/organizer/rules-and-restrictions`, {
                rules: rules,
                organizerId: organizerId,
            });
            // console.log('Rules and restrictions saved successfully', response.data);
            toast.success('Rules and restrictions saved successfully');
            setIsDataSaved(true);
        } catch (error) {
            console.error('Error posting rules data', error);
            setError('Failed to save rules and restrictions.');
            toast.error('Failed to save rules and restrictions');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow flex items-center justify-center">
                    <div className="max-w-2xl mx-auto p-4">
                        <h1 className="flex items-center justify-center text-2xl font-bold mb-4">Rules & Restrictions</h1>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex flex-col items-center">
                            <div className="mb-4 w-full">
                                <label htmlFor="rules" className="block mb-2 font-semibold text-red-500">
                                    Please add the rules and restrictions that apply to your event hall. This information
                                    will help your guests understand the guidelines they need to follow while using the venue.
                                    Ensure that your rules are clear and specific to avoid any misunderstandings.
                                </label>
                                <textarea
                                    id="rules"
                                    value={rules}
                                    onChange={(e) => setRules(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows={10}
                                    placeholder="Enter rules and restrictions for your hall..."
                                />
                            </div>
                            <button
                                type="submit"
                                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isDataSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDataSaved}
                            >
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

export default RulesAndRestrictions;
