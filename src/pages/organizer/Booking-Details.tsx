import React, { useEffect, useState } from "react";
import useAuthRedirect from "../../axios/useAuthRedirect";
import Header from "../../components/organizer/Header";
import { Menu, X } from "lucide-react";
import Footer from "../../components/organizer/Footer";
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SideMenu from "../../components/organizer/SideMenu";

interface Booking {
    _id: string;
    userName: string;
    bookedAt: string;
    bookingDate: string;
    eventName: string;
    contactNumber: string;
    email: string;
    status: "confirmed" | "canceled";
}



const BookingDetails: React.FC = () => {
    useAuthRedirect();
    const organizerId = Cookies.get('OrganizerId')
    //tab and menu states
    const [selectedTab, setSelectedTab] = useState("bookings");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // booking related states
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
    const [canceledBookings, setCanceledBookings] = useState<Booking[]>([]);
    const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
    const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "canceled">("all");

    const navigate = useNavigate();


    useEffect(() => {
        if (selectedTab === "bookings") {
            fetchBookings();
        } else if (selectedTab === "graphs") {
            navigate("/organizer/graph-details");

        }
    }, [selectedTab, navigate]);

    // ### get booking related data for show bookings details ### //

    const fetchBookings = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/organizer/booking-details`, {
                params: { organizerId }
            });

            if (response.data && Array.isArray(response.data.bookings)) {
                const fetchedBookings = response.data.bookings;
                setAllBookings(fetchedBookings);

                const confirmed = fetchedBookings.filter((booking: Booking) => booking.status === "confirmed");
                const canceled = fetchedBookings.filter((booking: Booking) => booking.status === "canceled");

                setConfirmedBookings(confirmed);
                setCanceledBookings(canceled);

                // Initially display all bookings
                setDisplayedBookings(fetchedBookings);

            } else {
                setError("Invalid response format for booking details.");
                console.error("Expected bookings array but got:", response.data);
            }
        } catch (error) {
            setError("Failed to fetch bookings.");
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    }

    // ### show data based on filter ### /// 

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as "all" | "confirmed" | "canceled";
        setFilterStatus(newStatus);

        // Update displayed bookings based on selected status
        switch (newStatus) {
            case "all":
                setDisplayedBookings(allBookings);
                break;
            case "confirmed":
                setDisplayedBookings(confirmedBookings);
                break;
            case "canceled":
                setDisplayedBookings(canceledBookings);
                break;
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex">
                {/* Sidebar */}

                <SideMenu
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />

                {/* Main Content */}
                <div className="flex-1 p-6 ml-0 md:ml-16 transition-all">
                    <Header />

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="md:hidden bg-blue-500 text-white p-2 rounded-md"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>


                    {/* Booking Details Tab */}
                    {selectedTab === "bookings" && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold mb-4 text-center">Booking Details</h2>
                            <div className="mt-12 mb-1 flex justify-end">
                                <label className="mr-2 self-center">Filter by status: </label>
                                <select
                                    value={filterStatus}
                                    onChange={handleStatusFilterChange}
                                    className="border rounded p-1"
                                >
                                    <option value="all">All</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </div>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Booking ID</th>
                                        <th className="border p-2">Customer</th>
                                        <th className="border p-2">Booked On</th>
                                        <th className="border p-2">Event Date</th>
                                        <th className="border p-2">Contact Number</th>
                                        <th className="border p-2">Email</th>
                                        <th className="border p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedBookings.map((booking) => (
                                        <tr key={booking._id} className="text-center">
                                            <td className="border p-2">{booking._id}</td>
                                            <td className="border p-2">{booking.userName}</td>
                                            <td className="border p-2">{new Date(booking.bookedAt).toLocaleDateString()}</td>
                                            <td className="border p-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                            <td className="border p-2">{booking.contactNumber}</td>
                                            <td className="border p-2">{booking.email}</td>
                                            <td
                                                className={`border p-2 font-semibold ${booking.status === "confirmed" ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {displayedBookings.length === 0 && (
                                <p className="text-center mt-4 text-gray-500">
                                    No bookings found for the selected status.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cancellation Requests Tab */}
                    {selectedTab === "cancellations" && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold">Cancellation Requests</h2>
                            <p>List of cancellation requests will appear here.</p>
                        </div>
                    )}

                    {/* Refund Details Tab */}
                    {selectedTab === "refunds" && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold">Refund Details</h2>
                            <p>Refund information will be displayed here.</p>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookingDetails;
