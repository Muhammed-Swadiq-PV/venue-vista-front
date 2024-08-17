import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios/axiosInterceptor";
import useAuthRedirect from "../../axios/useAuthRedirect";
import { API_BASE_URL } from "../../apiConfig";
import Cookies from "js-cookie";
import Header from "../../components/organizer/Header";
import Footer from "../../components/organizer/Footer";
import LocationModal from "../../components/organizer/LocationModal";
import { toast } from "react-toastify";
import { LatLng } from "leaflet";

const ViewProfile: React.FC = () => {
    useAuthRedirect();

    const [profileData, setProfileData] = useState<any>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const organizerId = Cookies.get("OrganizerId");

    useEffect(() => {
        const fetchOrganizerProfile = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/organizer/profile/${organizerId}`);
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to fetch profile data.");
            }
        };

        fetchOrganizerProfile();
    }, [organizerId]);

    const handleLocationSubmit = async (location: LatLng) => {
        try {

            const organizerId = Cookies.get('OrganizerId');

            const locationData = {
                lat: location.lat,
                lng: location.lng,
                organizerId
            };

            await axiosInstance.post('/organizer/savelocation', locationData);

            toast.success("Location added successfully!");
            setTimeout(() => {
                setIsLocationModalOpen(false);
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Error saving location:", error);
            toast.error("Failed to save location.");
        }
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 pt-20">
                <h1 className="text-2xl mb-4 text-center">Your Profile</h1>
                <div className="bg-white shadow-md rounded p-4 md:p-6 lg:p-8 max-w-xl mx-auto">
                    <p className="text-lg mb-2"><strong>Name:</strong> {profileData.name}</p>
                    <p className="text-lg mb-2"><strong>Email:</strong> {profileData.email}</p>
                    <p className="text-lg mb-2"><strong>Event Hall Name:</strong> {profileData.eventHallName}</p>
                    <p className="text-lg mb-2"><strong>Building Floor:</strong> {profileData.buildingFloor}</p>
                    <p className="text-lg mb-2"><strong>City:</strong> {profileData.city}</p>
                    <p className="text-lg mb-2"><strong>District:</strong> {profileData.district}</p>
                    <p className="text-lg mb-2"><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
                    <p className="text-lg mb-2"><strong>Pincode:</strong> {profileData.pincode}</p>

                    {/* Conditionally render the Add Location button */}
                    {!profileData.location && (
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 ease-in-out mx-auto block"
                            onClick={() => setIsLocationModalOpen(true)}
                        >
                            Add Location
                        </button>
                    )}
                </div>
            </main>
            <Footer />

            {/* Show LocationModal when the button is clicked */}
            {isLocationModalOpen && (
                <LocationModal
                    isOpen={isLocationModalOpen}
                    onClose={() => setIsLocationModalOpen(false)}
                    onSave={handleLocationSubmit}
                />
            )}
        </div>
    );
};

export default ViewProfile;
