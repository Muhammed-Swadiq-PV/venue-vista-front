import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import Spinner from '../../components/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAxiosInterceptor } from '../../axios/useAxiosInterceptor';
import defaultImage from '../../assets/organizer-assets/k-hills 1.png';
import Header from '../../components/auth/Header';
import Footer from '../../components/auth/Footer';

interface EventHall {
    _id: string;
    organizerId: string;
    main: {
        images: string[];
        description: string;
    };
    dining: {
        images: string[];
        description: string;
        seatingCapacity?: number;
    };
    indoor: {
        images: string[];
        description: string;
        seatingCapacity?: number;
    };
    parking: {
        images: string[];
        description: string;
        carParkingSpace?: number;
        bikeParkingSpace?: number;
    };
    stage: {
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
    district: string;
    city: string;
    buildingFloor: string;
}

interface ResponseData {
    eventHalls: EventHall[];
    organizers: Organizer[];
}

const EventHallDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const axiosInstance = useAxiosInterceptor();
    const [data, setData] = useState<EventHall | null>(null);
    const [organizer, setOrganizer] = useState<Organizer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosInstance.get<ResponseData>(`${API_BASE_URL}/users/event-hall/${id}`);
                // console.log(response.data, 'response');
                setData(response.data.eventHalls[0]);
                setOrganizer(response.data.organizers[0]);
            } catch (err) {
                console.error('Error fetching event hall details:', err);
                setError('Failed to load event hall details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, axiosInstance]);

    if (loading) {
        return <Spinner text="Loading details..." />;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!data || !organizer) {
        return <div className="text-red-500 text-center">No event hall details found.</div>;
    }

    const renderSection = (title: string, section: { images: string[]; description: string, carParkingSpace?: number, bikeParkingSpace?: number, seatingCapacity?: number, diningCapacity?:number }) => (
        <div className="bg-white p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-slate-50 via-slate-300 to-slate-50 rounded-lg">{title}</h2>
            <div className="flex flex-wrap justify-center mb-4 bg-white rounded-lg p-4">
                {section.images.map((image, index) => (
                    <img
                        key={index}
                        src={image || defaultImage}
                        alt={`${title} ${index + 1}`}
                        className="w-40 h-40 p-1  "
                    />

                ))}
            </div>
            <p className=' p-5 rounded-md bg-gradient-to-b from-white from-35%  to-slate-200'>{section.description}</p>
            {section.carParkingSpace!== undefined && <p className='font-bold'>Car Parking Space: <span className='font-bold'>{section.carParkingSpace}</span></p>}
            {section.bikeParkingSpace !== undefined && <p className='font-bold'>Bike Parking Space: <span className='font-bold'>{section.bikeParkingSpace}</span> </p>}
            {section.seatingCapacity !== undefined && <p className='font-bold'>Seating Capacity:<span className='font-bold'>{section.seatingCapacity}</span> </p>}
            {section.diningCapacity !== undefined && <p className='font-bold'>Dining Capacity:<span className='font-bold'>{section.diningCapacity}</span> </p>}
        </div>
    );

    return (
        <>
        
        <Header/>
        <div className="flex flex-col min-h-screen px-52">
            <main className="flex-grow bg-blue-100 mt-12 mb-4 p-4 sm:p-6 lg:p-8">
                <ErrorBoundary>
                    <div className="bg-white p-4 mb-5">
                        <h2 className="text-4xl font-semibold mb-4 text-center">{organizer.name}</h2>
                        <div className='flex space-x-2'>
                            <div className="w-1/2 mx-auto">
                                <img
                                    src={data.main.images[0] || defaultImage}
                                    alt="Main"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="flex flex-col items-start bg-slate-200 rounded-md w-1/2">
                                <div className='px-10 py-8'>

                                    <p className="text-center">{data.main.description}</p>
                                </div>

                                <div className=" items-center text-left pl-5">
                                    <p className="mb-2">City: <span className='font-bold'>{organizer.city}</span></p>
                                    <p className="mb-2">District: <span className='font-bold'>{organizer.district}</span></p>
                                    <p className='mb-2'>Phone Number: <span className='font-bold'>{organizer.phoneNumber}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {renderSection('Dining', data.dining)}
                    {renderSection('Indoor', data.indoor)}
                    {renderSection('Parking', data.parking)}
                    {renderSection('Stage', data.stage)}
                </ErrorBoundary>
            </main>
        </div>
        <Footer/>
        </>
    );
};

export default EventHallDetails;
