import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../apiConfig";
import Spinner from "../../components/Spinner";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useAxiosInterceptor } from "../../axios/useAxiosInterceptor";
import defaultImage from '../../assets/organizer-assets/k-hills 1.png';
import Header from "../../components/organizer/Header";
import Footer from "../../components/organizer/Footer";
import PostEditModal from "../../components/organizer/PostEditModal";
import Cookies from "js-cookie";

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
        diningCapacity?: number;
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

const ViewPost: React.FC = () => {
    const organizerId = Cookies.get('OrganizerId');
    const axiosInstance = useAxiosInterceptor();
    const [data, setData] = useState<EventHall | null>(null);
    const [organizer, setOrganizer] = useState<Organizer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState<{ title: string; data: any } | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axiosInstance.get<ResponseData>(`${API_BASE_URL}/organizer/view-post/${organizerId}`);
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
    }, [organizerId, axiosInstance]);

    if (loading) {
        return <Spinner text="Loading details..." />;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!data || !organizer) {
        return <div className="text-red-500 text-center">No event hall details found.</div>;
    }

    const handleEdit = (section: string, sectionData: any) => {
        setCurrentSection({ title: section, data: sectionData });
        setIsModalOpen(true);
    };

    const handleSave = async (updatedData: any) => {
        if (currentSection) {
            // Prepare payload with only necessary fields based on the section
            const payload: any = {};

            switch (currentSection.title.toLowerCase()) {
                case 'dining':
                    payload.dining = {
                        images: updatedData.images,
                        description: updatedData.description,
                        seatingCapacity: updatedData.diningCapacity,
                    };
                    break;

                case 'indoor':
                    payload.indoor = {
                        images: updatedData.images,
                        description: updatedData.description,
                        seatingCapacity: updatedData.seatingCapacity,
                    };
                    break;

                case 'parking':
                    payload.parking = {
                        images: updatedData.images,
                        description: updatedData.description,
                        carParkingSpace: updatedData.carParkingSpace,
                        bikeParkingSpace: updatedData.bikeParkingSpace,
                    };
                    break;

                case 'stage':
                    payload.stage = {
                        images: updatedData.images,
                        description: updatedData.description,
                    };
                    break;

                default:
                    console.warn('Unknown section:', currentSection.title);
                    return; // Exit if the section is unknown
            }

            // Log the payload that will be sent
            console.log('Payload to be sent:', payload);

            // Send the updated data to the backend
            try {
                const response = await axiosInstance.patch(`${API_BASE_URL}/organizer/update-post/${organizerId}`, {
                    section: currentSection.title,
                    data: updatedData,
                });
                console.log('Server Response:', response.data);
            } catch (err) {
                // Log any errors that occur
                console.error('Error updating event hall details:', err);
            }

            setIsModalOpen(false);
        }
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderSection = (title: string, section: { images: string[]; description: string, carParkingSpace?: number, bikeParkingSpace?: number, seatingCapacity?: number, diningCapacity?: number }) => (
        <div className="bg-white p-4 mb-6 space-y-2">
            <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-slate-50 via-slate-300 to-slate-50 rounded-lg">{title}</h2>
            <div className="flex flex-wrap justify-center mb-4 bg-white rounded-lg p-4">
                {section.images.map((image, index) => (
                    <img
                        key={index}
                        src={image || defaultImage}
                        alt={`${title} ${index + 1}`}
                        className="w-40 h-40 p-1"
                    />
                ))}
            </div>
            <p className="p-5 rounded-md bg-gradient-to-b from-white from-35% to-slate-200">{section.description}</p>
            {section.carParkingSpace !== undefined && <p>Car Parking Space: {section.carParkingSpace}</p>}
            {section.bikeParkingSpace !== undefined && <p>Bike Parking Space: {section.bikeParkingSpace}</p>}
            {section.seatingCapacity !== undefined && <p>Seating Capacity: {section.seatingCapacity}</p>}
            {section.diningCapacity !== undefined && <p>Dining Capacity: {section.diningCapacity}</p>}
            <div className="flex justify-center pt-1">
                <button
                    onClick={() => handleEdit(title, section)}
                    className="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
                >
                    Edit {title}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="flex flex-col min-h-screen sm:px-4 lg:px-20 xl:px-56 pt-8">
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <ErrorBoundary>
                        <div className="bg-white p-4 mb-5">
                            <h2 className="text-4xl font-semibold mb-4 text-center">{organizer.name}</h2>
                            <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                                <div className="w-1/2 mx-auto">
                                    <img
                                        src={data.main.images[0] || defaultImage}
                                        alt="Main"
                                        className="w-full h-auto object-cover "
                                    />
                                </div>
                                <div className="flex flex-col items-start bg-slate-200 rounded-md w-full md:w-1/2">
                                    <div className='px-10 py-8'>
                                        <p className="text-center">{data.main.description}</p>
                                    </div>
                                    <div className="items-center text-left pl-4 sm:pl-5">
                                        <p className="mb-2">City: <span className='font-bold'>{organizer.city}</span></p>
                                        <p className="mb-2">District: <span className='font-bold'>{organizer.district}</span></p>
                                        <p className='mb-2'>Phone Number: <span className='font-bold'>{organizer.phoneNumber}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center mt-2">
                                <button
                                    onClick={() => handleEdit('Main', data.main)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded transition-colors duration-300 ease-in-out hover:bg-green-600 hover:shadow-lg"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                        {renderSection('Dining', data.dining)}
                        {renderSection('Indoor', data.indoor)}
                        {renderSection('Parking', data.parking)}
                        {renderSection('Stage', data.stage)}

                        {isModalOpen && currentSection && (
                            <PostEditModal
                                isOpen={isModalOpen}
                                onRequestClose={handleCancel}
                                sectionTitle={currentSection.title}
                                sectionData={currentSection.data}
                                onSave={handleSave}
                            />
                        )}
                    </ErrorBoundary>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default ViewPost;
