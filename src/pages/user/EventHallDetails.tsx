import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import Spinner from '../../components/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAxiosInterceptor } from '../../axios/useAxiosInterceptor';
import defaultImage from '../../assets/organizer-assets/k-hills 1.png';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosInstance.get<ResponseData>(`${API_BASE_URL}/users/event-hall/${id}`);
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

    const handleBooking = () => {
        navigate(`/book-event-hall/${id}`);
    };

    const renderSection = (title: string, section: { images: string[]; description: string, carParkingSpace?: number, bikeParkingSpace?: number, seatingCapacity?: number, diningCapacity?: number }) => (
        <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-slate-50 via-slate-300 to-slate-50 rounded-lg py-2">{title}</h2>
            <div className="flex flex-wrap justify-center mb-4 bg-white rounded-lg p-2 md:p-4">
                {section.images.map((image, index) => (
                    <img
                        key={index}
                        src={image || defaultImage}
                        alt={`${title} ${index + 1}`}
                        className="w-24 h-24 md:w-40 md:h-40 p-1 object-cover"
                    />

                ))}
            </div>
            <p className='p-3 md:p-5 rounded-md bg-gradient-to-b from-white from-35% to-slate-200'>{section.description}</p>
            <div className="mt-4 space-y-2">
                {section.carParkingSpace !== undefined && <p className='font-semibold'>Car Parking Space: <span className='font-normal'>{section.carParkingSpace}</span></p>}
                {section.bikeParkingSpace !== undefined && <p className='font-semibold'>Bike Parking Space: <span className='font-normal'>{section.bikeParkingSpace}</span></p>}
                {section.seatingCapacity !== undefined && <p className='font-semibold'>Seating Capacity: <span className='font-normal'>{section.seatingCapacity}</span></p>}
                {section.diningCapacity !== undefined && <p className='font-semibold'>Dining Capacity: <span className='font-normal'>{section.diningCapacity}</span></p>}
            </div>
        </div>
    );

    return (
        <>

            <Header />
            <div className="flex flex-col mt-6 min-h-screen px-4 md:px-8 lg:px-16 xl:px-52">
                <main className="flex-grow bg-blue-100 mt-12 mb-4 p-4 sm:p-6 lg:p-8">
                    <ErrorBoundary>
                        <div className="bg-white p-4 mb-5 rounded-lg shadow-md">
                            <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-center">{organizer.name}</h2>
                            <div className='flex flex-col md:flex-row md:space-x-4'>
                                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                    <img
                                        src={data.main.images[0] || defaultImage}
                                        alt="Main"
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col items-start bg-slate-200 rounded-md w-full md:w-1/2 p-4">
                                    <div className='mb-4'>
                                        <p className="text-center">{data.main.description}</p>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <p>City: <span className='font-semibold'>{organizer.city}</span></p>
                                        <p>District: <span className='font-semibold'>{organizer.district}</span></p>
                                        <p>Phone Number: <span className='font-semibold'>{organizer.phoneNumber}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {renderSection('Experience the Perfect Dining Ambiance', data.dining)}
                        {renderSection('Discover Exceptional Facilities for Unforgettable Events', data.indoor)}
                        {renderSection('Convenient & Secure Parking for Your Peace of Mind', data.parking)}
                        {renderSection('Elevate Your Event with Our Stunning Stage', data.stage)}

                    </ErrorBoundary>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default EventHallDetails;
