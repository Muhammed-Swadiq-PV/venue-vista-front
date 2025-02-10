import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import useAuthRedirect from "../../axios/useAuthRedirect";
import Header from "../../components/organizer/Header";
import { Menu, X } from "lucide-react";
import Footer from "../../components/organizer/Footer";
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";
import Cookies from "js-cookie";
import { format } from "path";

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

interface GraphData {
    name: string;
    dayBooking?: number;
    nightBooking?: string;
    fullDayBooking?: number;
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
    //graph related states
    const [monthlyData, setMonthlyData] = useState<GraphData[]>([]);
    const [yearlyData, setYearlyData] = useState<GraphData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [yearSelected, setYearSelected] = useState<string>(new Date().getFullYear().toString());




    useEffect(() => {
        if (selectedTab === "bookings") {
            fetchBookings();
        } else if (selectedTab === "graphs") {
            fetchGraphData();
        }
    }, [selectedTab]);

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

    // ### get booking related data to show graph ### //

    const fetchGraphData = async () => {
        try {
            setLoading(true);
            const monthlyResponse = await axiosInstance.get(`${API_BASE_URL}/organizer/bookings/monthly`,
                {
                    params: {
                        selectedMonth,
                        selectedYear,
                        organizerId
                    }
                }
            );

            if (!monthlyResponse.data || !Array.isArray(monthlyResponse.data)) {
                console.error("Invalid monthly data:", monthlyResponse.data);
                return;
            }

            console.log(monthlyResponse.data)
            const bookingsByDate: Record<string, { day: number; night: number; fullDay: number }> = {};

            monthlyResponse.data.forEach((entry: { _id: number; bookings: { bookingTime: string }[] }) => {
                entry.bookings.forEach((booking: { bookingTime: string }) => { // Define type explicitly
                    const date = entry._id || "Unknown Date";

                    // Initialize the date entry if not already present
                    if (!bookingsByDate[date]) {
                        bookingsByDate[date] = { day: 0, night: 0, fullDay: 0 };
                    }

                    // Categorize bookings based on your database values
                    if (booking.bookingTime === "full") {
                        bookingsByDate[date].fullDay = 1; // Full day overrides everything
                        bookingsByDate[date].day = 0;
                        bookingsByDate[date].night = 0;
                    } else if (booking.bookingTime === "day" && bookingsByDate[date].fullDay === 0) {
                        bookingsByDate[date].day = 1;
                    } else if (booking.bookingTime === "night" && bookingsByDate[date].fullDay === 0) {
                        bookingsByDate[date].night = 1;
                    }
                });
            });

            // Convert the processed data into the format required by Recharts
            const formattedMonthlyData = Object.keys(bookingsByDate)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort by date
                .map((date) => ({
                    name: date,
                    day: bookingsByDate[date].day,
                    night: bookingsByDate[date].night,
                    fullDay: bookingsByDate[date].fullDay,
                }));
            setMonthlyData(formattedMonthlyData);


            //API call for yearly data
            const yearlyResponse = await axiosInstance.get(`${API_BASE_URL}/organizer/bookings/yearly`,
                {
                    params: {
                        yearSelected,
                        organizerId
                    }
                }
            );

            const formattedYearlyData = yearlyResponse.data.map((item: { month: string;  day: number; night: number; fullDay: number }) => ({
                month: item.month, 
                day: item.day,     
                night: item.night, 
                fullDay: item.fullDay
            }));

            setYearlyData(formattedYearlyData);
        } catch (error) {
            console.error("Error fetching yearly data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraphData();
    }, [selectedMonth, selectedYear, yearSelected]);


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

                    {/* Graphs Tab */}
                    {selectedTab === "graphs" && (
                        <div className="mt-16">
                            {/* Monthly Bookings Overview */}
                            <h2 className="text-xl font-semibold mb-4 text-center">Monthly Bookings Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [value, "Bookings"]} />
                                    <Legend />
                                    <Bar dataKey="day" stackId="a" fill="#4F46E5" name="Day Bookings" />
                                    <Bar dataKey="night" stackId="a" fill="#10B981" name="Night Bookings" />
                                    <Bar dataKey="fullDay" stackId="a" fill="#E11D48" name="Full Day Bookings" />
                                </BarChart>
                            </ResponsiveContainer>


                            <h2 className="text-xl font-semibold mt-6 mb-4 text-center">Yearly Bookings Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {/* Stacked bars */}
                                    <Bar dataKey="day" fill="#82ca9d" name="Day Bookings" stackId="a" />
                                    <Bar dataKey="night" fill="#8884d8" name="Night Bookings" stackId="a" />
                                    <Bar dataKey="fullDay" fill="#10B981" name="Full Day Bookings" stackId="a" />
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
