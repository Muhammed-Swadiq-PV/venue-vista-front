import React, { useState, useEffect } from "react";
import useAuthRedirect from "../../axios/useAuthRedirect";
import Cookies from "js-cookie";
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { Menu } from "lucide-react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Footer from "./Footer";

interface GraphData {
    name: string;
    dayBooking?: number;
    nightBooking?: string;
    fullDayBooking?: number;
}

const Graph: React.FC = () => {

    useAuthRedirect();
    const organizerId = Cookies.get('OrganizerId')

    const [selectedTab, setSelectedTab] = useState("graphs");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [monthlyData, setMonthlyData] = useState<GraphData[]>([]);
    const [yearlyData, setYearlyData] = useState<GraphData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [yearSelected, setYearSelected] = useState<string>(new Date().getFullYear().toString());

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

            const formattedYearlyData = yearlyResponse.data.map((item: { month: string; day: number; night: number; fullDay: number }) => ({
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

                <SideMenu
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />

                <div className="flex-1 p-6 ml-0 md:ml-16 transition-all">
                    <Header />

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="md:hidden bg-blue-500 text-white p-2 rounded-md"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    {/* Graphs Tab */}
                    {/* {selectedTab === "graphs" && ( */}
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
                    {/* )} */}
                    </div>
                </div>
                <Footer/>
            </div>
            )
}

            export default Graph;