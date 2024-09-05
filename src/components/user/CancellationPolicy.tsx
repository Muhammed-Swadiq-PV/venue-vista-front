import React, { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import Header from '../organizer/Header';
import Footer from '../organizer/Footer';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';
import useAuthRedirect from '../../axios/useAuthRedirect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CancellationPolicy: React.FC = () => {
    useAuthRedirect();

    const [policy, setPolicy] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDataSaved, setIsDataSaved] = useState(false);

    const organizerId = Cookies.get('OrganizerId');

    useEffect(() => {
        const fetchCancellationPolicy = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/organizer/cancellation-policy`, {
                    params: { organizerId }
                });
                if (response.data && response.data.policy) {
                    setPolicy(response.data.policy);
                    setIsDataSaved(true);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cancellation policy:', error);
                setError('Failed to load cancellation policy.');
                setLoading(false);
            }
        };

        fetchCancellationPolicy();
    }, [organizerId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/organizer/cancellation-policy`, {
                policy: policy,
                organizerId: organizerId,
            });
            toast.success('Cancellation policy saved successfully');
            setIsDataSaved(true); // Disable save button after successful save
        } catch (error) {
            console.error('Error saving cancellation policy', error);
            setError('Failed to save cancellation policy.');
            toast.error('Failed to save cancellation policy');
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex flex-col min-h-screen">
                    <div className="flex-grow flex items-center justify-center">
                        <Spinner />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="flex flex-col min-h-screen">
                <div className="flex-grow flex items-center justify-center">
                    <div className="max-w-2xl mx-auto p-4">
                        <h1 className="flex items-center justify-center text-2xl font-bold mb-4">
                            Cancellation Policy
                        </h1>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
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
                        {!isDataSaved && ( 
                                <button 
                                    type="submit" 
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            )}
                            </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CancellationPolicy;
