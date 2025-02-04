import React, { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Cell } from 'recharts';
import axiosInstance from "../../axios/axiosInterceptor";
import { API_BASE_URL } from "../../apiConfig";

interface GraphData {
    name: string;
    value: string;
    month?: string;
    bookings?: number;
}

const AdminGraph: React.FC = () => {
    const [monthlyData, setMonthlyData] = useState<GraphData[]>([]);
    const [yearlyData, setYearlyData] = useState<GraphData[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    const currentDate = new Date();
    const month = selectedMonth;
    const year = selectedYear;

    console.log(month, year, 'month and year')




    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                // API call for monthly data
                const monthlyResponse = await axiosInstance.get(`${API_BASE_URL}/admin/bookings/monthly`,
                    {
                        params: {
                            month,
                            year
                        }
                    }
                );
                console.log(monthlyResponse, 'monthly response')
                const formattedMonthlyData = monthlyResponse.data.map((item: { date: string; bookings: number }) => ({
                    name: item.date,
                    value: item.bookings,
                }));
                setMonthlyData(formattedMonthlyData);

                // API call for yearly data
                const yearlyResponse = await axiosInstance.get(`${API_BASE_URL}/admin/bookings/yearly`);
                const formattedYearlyData = yearlyResponse.data.map((item: { year: string; totalBookings: number }) => ({
                    name: item.year,
                    value: item.totalBookings,
                }));
                setYearlyData(formattedYearlyData);
            } catch (error) {
                console.error("Error fetching booking data", error);
            }
        };

        fetchGraphData();
    }, [month, year]);

    return (
        <div className="p-4">
            {/* Monthly chart(LineChart) */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Booking Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval="preserveStartEnd" />
                        <YAxis tickFormatter={(value) => Math.round(value).toString()} allowDecimals={false} />
                        <Tooltip formatter={(value, name) => [value, 'Bookings']} />
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

            {/* Yearly Chart (PieChart) */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Yearly Booking Insights</h2>
                <ResponsiveContainer width="100%" height={300}>
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