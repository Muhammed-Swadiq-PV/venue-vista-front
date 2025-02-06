import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import useAuthRedirect from "../../axios/useAuthRedirect";
import Header from "../../components/organizer/Header";
import { Menu, X } from "lucide-react";
import Footer from "../../components/organizer/Footer";
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";
import Cookies from "js-cookie";

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

    const [selectedTab, setSelectedTab] = useState("bookings");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
    // const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    // const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "canceled">("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
    const [canceledBookings, setCanceledBookings] = useState<Booking[]>([]);
    const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
    const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "canceled">("all");


    // Sample Data for Monthly and Yearly Bookings
    const monthlyData = [
        { month: "Jan", bookings: 30 },
        { month: "Feb", bookings: 50 },
        { month: "Mar", bookings: 40 },
        { month: "Apr", bookings: 60 },
        { month: "May", bookings: 70 },
        { month: "Jun", bookings: 55 },
        { month: "Jul", bookings: 80 },
        { month: "Aug", bookings: 90 },
        { month: "Sep", bookings: 75 },
        { month: "Oct", bookings: 85 },
        { month: "Nov", bookings: 95 },
        { month: "Dec", bookings: 100 },
    ];

    const yearlyData = [
        { year: "2020", bookings: 500 },
        { year: "2021", bookings: 800 },
        { year: "2022", bookings: 1200 },
        { year: "2023", bookings: 1500 },
        { year: "2024", bookings: 1700 },
    ];

    useEffect(() => {
        if (selectedTab === "bookings") {
            fetchBookings();
        }
    }, [selectedTab]);

    const fetchBookings = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/organizer/booking-details`, {
                params: { organizerId }
            });

            // console.log(response.data, 'response for booking details');
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
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-100  text-red-500 transform transition-transform duration-300 ease-in-out 
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:relative  mt-16 mb-2 rounded-tr-lg rounded-br-lg shadow-lg`}
                >
                    <button
                        className="absolute top-4 right-4 md:hidden text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">Menu</h2>
                        <nav className="flex flex-col space-y-4">
                            {["bookings", "graphs", "cancellations", "refunds"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded-md text-left ${selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                                        }`}
                                    onClick={() => {
                                        setSelectedTab(tab);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    {tab === "bookings"
                                        ? "Booking Details"
                                        : tab === "graphs"
                                            ? "Graphs"
                                            : tab === "cancellations"
                                                ? "Cancellation Requests"
                                                : "Refund Details"}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

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

                    {/* Booking Details Tab */}
                    {selectedTab === "bookings" && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold mb-4 text-center">Booking Details</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Booking ID</th>
                                        <th className="border p-2">Customer</th>
                                        <th className="border p-2">Booked On</th> {/* New column for booking date */}
                                        <th className="border p-2">Event Date</th> {/* New column for event conducting date */}
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


                    {/* Graphs Tab */}
                    {selectedTab === "graphs" && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold mb-4 text-center">Monthly Bookings Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="bookings" fill="#4F46E5" />
                                </BarChart>
                            </ResponsiveContainer>

                            <h2 className="text-xl font-semibold mt-6 mb-4 text-center">Yearly Bookings Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="bookings" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
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
