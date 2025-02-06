import React, { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Cell } from 'recharts';
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";

interface GraphData {
    name: string;
    value: number;
    month?: string;
    bookings?: number;
}

const AdminGraph: React.FC = () => {
    const [monthlyData, setMonthlyData] = useState<GraphData[]>([]);
    const [yearlyData, setYearlyData] = useState<GraphData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [yearSelected, setYearSelected] = useState<string>(new Date().getFullYear().toString());

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                // API call for monthly data
                const monthlyResponse = await axiosInstance.get(`${API_BASE_URL}/admin/bookings/monthly`,
                    {
                        params: {
                            selectedMonth,
                            selectedYear
                        }
                    }
                );
                // console.log(monthlyResponse, 'monthly response')
                const formattedMonthlyData = monthlyResponse.data.map((item: { date: string; bookings: number }) => ({
                    name: item.date,
                    value: item.bookings,
                }));
                setMonthlyData(formattedMonthlyData);

                // API call for yearly data
                const yearlyResponse = await axiosInstance.get(`${API_BASE_URL}/admin/bookings/yearly`,
                    {
                        params: {
                            yearSelected
                        }
                    }
                );

                const formattedYearlyData = yearlyResponse.data.map((item: { month: string; bookings: number }) => ({
                    name: item.month,
                    value: item.bookings,
                }));
                setYearlyData(formattedYearlyData);
            } catch (error) {
                console.error("Error fetching booking data", error);
            }
        };

        fetchGraphData();
    }, [selectedMonth, selectedYear, yearSelected]);

    const monthOptions = Array.from({ length: 12 }, (_, i) =>
        ((i + 1).toString().padStart(2, '0'))
    );

    const yearOptions = Array.from({ length: 5 }, (_, i) =>
        (new Date().getFullYear() - 2 + i).toString()
    );

    return (
        <div className="pl-4">
            <div className="flex mb-4 space-x-4">
                <div className="ml-4 sm:ml-8 md:ml-16 lg:ml-24 xl:ml-32">
                    <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">Month</label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {monthOptions.map(month => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">Year</label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Monthly chart(LineChart) */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Booking Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval="preserveStartEnd" />
                        <YAxis tickFormatter={(value) => Math.round(value).toString()} allowDecimals={false} />
                        <Tooltip formatter={(value) => [value, 'Bookings']} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            activeDot={false}
                            dot={false}
                            name="Bookings"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </section>

            <div className="flex justify-center my-6 w-full">
                <label htmlFor="year-select" className="mr-2 text-sm font-medium text-gray-700">Select Year:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setYearSelected(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {/* Yearly Chart (PieChart) */}
            <section className="mb-8 w-full">
                <h2 className="text-xl font-semibold mb-4">Yearly Booking Insights</h2>
                <ResponsiveContainer width="100%" height={450}>
                    <PieChart>
                        <Pie
                            data={yearlyData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {yearlyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </section>
        </div>
    )
}

export default AdminGraph;