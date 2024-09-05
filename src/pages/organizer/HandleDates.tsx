import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PriceDetailsModal from '../../components/organizer/PriceDetailsModal';
import EventDetailsModal from '../../components/organizer/EventDetailsModal';
import axiosInstance from '../../axios/axiosInterceptor';
import { Prices } from '../../types/prices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DayModal from '../../components/organizer/DayModal';
import { API_BASE_URL } from '../../apiConfig';
import Cookies from 'js-cookie';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from '../../components/organizer/Header';
import Footer from '../../components/organizer/Footer';

const localizer = momentLocalizer(moment);

interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color: string;
    type: 'day' | 'night' | 'full';
    details?: string;
}

const HandleDates: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [eventDetails, setEventDetails] = useState<Event | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const [initialPrices, setInitialPrices] = useState<Prices>({
        dayPrice: '',
        nightPrice: '',
        fullDayPrice: ''
    });

    const [weeklyPrices, setWeeklyPrices] = useState<{
        [key: string]: { dayPrice: number; nightPrice: number; fullDayPrice: number }
    }>({
        Monday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Tuesday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Wednesday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Thursday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Friday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Saturday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 },
        Sunday: { dayPrice: 0, nightPrice: 0, fullDayPrice: 0 }
    });


    const organizerId = Cookies.get('OrganizerId');

    const fetchEvents = useCallback(async (start: Date, end: Date) => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/organizers/events`, {
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    organizerId: organizerId
                }
            });
            const fetchedEvents = response.data.map((event: any) => ({
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                type: event.type,
                color: event.type === 'full' ? '#ef4444' : event.type === 'day' ? '#3b82f6' : '#f59e0b',
                details: event.details,
            }));
            setEvents(fetchedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, [organizerId]);

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        fetchEvents(start, end);
    }, [fetchEvents]);


    const handleDateClick = async (date: Date) => {
        const today = moment().startOf('day');
        setSelectedDate(date);

        if (moment(date).isBefore(today, 'day')) {
            // Past date showing booking details
            const pastEvent = events.find(event =>
                moment(date).isSame(event.start, 'day')
            );
            if (pastEvent) {
                setEventDetails(pastEvent);
                setIsDetailsModalOpen(true);
            }
        } else {
            // Future date if booked day & night or full show complete booking details
            // if not booked the date show an option for view price if need to change the price added option for update price
            // if date booked partially show option for view booked details , also if need to change rest of that date also added an option
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/organizer/events/prices`, {
                    params: {
                        date: date.toISOString(),
                        organizerId: organizerId
                    }
                });

                const existingPrices = response.data.prices;
                console.log('Existing price:', existingPrices);

                setInitialPrices({
                    dayPrice: existingPrices.dayPrice ,
                    nightPrice: existingPrices.nightPrice ,
                    fullDayPrice: existingPrices.fullDayPrice ,
                });

                setIsModalOpen(true);
                setEventDetails({
                    ...existingPrices,
                    bookings: events.filter(event =>
                        moment(date).isSame(event.start, 'day')
                    ),
                });
            } catch (error) {
                console.error('Error fetching prices:', error);
            }
        }
    };



    const handleSavePrices = async (prices: { dayPrice: number; nightPrice: number; fullDayPrice: number }) => {
        try {
            await axiosInstance.post(`${API_BASE_URL}/organizer/events/prices`, {
                date: selectedDate,
                organizerId: organizerId,
                ...prices,
            });
            setIsModalOpen(false);
            toast.success('Prices updated successfully!')
        } catch (error) {
            console.error('Error saving prices:', error);
            toast.error('Failed to update prices. Please try again.');
        }
    };


    const handleSaveWeeklyPrices = async () => {
        try {
            await axiosInstance.post(`${API_BASE_URL}/organizer/default-prices`, {
                organizerId: organizerId,
                weeklyPrices: weeklyPrices
            });
            toast.success('Default weekly prices updated successfully!');
        } catch (error) {
            console.error('Error saving weekly prices:', error);
            toast.error('Failed to update weekly prices. Please try again.');
        }
    };

    const eventStyleGetter = (event: Event) => {
        return {
            style: {
                backgroundColor: event.color,
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                color: '#fff',
            },
        };
    };

    return (
        <>
            <Header />
            {showAnnouncement && (
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md mb-4">
                    <h3 className="font-semibold text-lg">Important Notice</h3>
                    <p className="mt-2">
                        Before you start managing individual dates, please ensure you have set default weekly prices. These will apply throughout the year.
                        Use the calendar to manage special dates where you may want to adjust prices. Click on a date to view or update prices.
                    </p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => setShowAnnouncement(false)}
                    >
                        Got It!
                    </button>
                </div>
            )}
            <div className="p-4 max-w-6xl mx-auto">
                <div className="text-lg font-bold mt-10 mb-4 text-center">
                    Manage Dates & Prices
                </div>
                <div className="mb-8">
                    <h3 className="text-md font-semibold mb-4">Set Default Weekly Prices</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Object.keys(weeklyPrices).map(day => (
                            <button
                                key={day}
                                className="p-4 border rounded-lg shadow hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedDay(day);
                                    setIsDayModalOpen(true);
                                }}
                            >
                                <h4 className="font-semibold">{day}</h4>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center text-right mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleSaveWeeklyPrices}
                    >
                        Save Default Prices
                    </button>
                </div>

                {isDayModalOpen && selectedDay && (
                    <DayModal
                        isOpen={isDayModalOpen}
                        onRequestClose={() => setIsDayModalOpen(false)}
                        day={selectedDay}
                        prices={weeklyPrices[selectedDay]}
                        onSavePrices={(day, prices) => {
                            setWeeklyPrices(prev => ({
                                ...prev,
                                [day]: prices
                            }));
                        }}
                    />
                )}
                <div className="relative mt-14 h-[70vh] w-[70vw] mx-auto bg-blue-50 shadow-lg rounded-lg">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        selectable={true}
                        onSelectSlot={({ start }) => handleDateClick(start)}
                        eventPropGetter={eventStyleGetter}
                        views={['month', 'week', 'day']}
                        className="text-sm sm:text-base"
                    />
                </div>

                {isModalOpen && selectedDate && (
                    <PriceDetailsModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        selectedDate={selectedDate!}
                        onSavePrices={handleSavePrices}
                        initialPrices={initialPrices}
                    />
                )}

                {isDetailsModalOpen && eventDetails && (
                    <EventDetailsModal
                        isOpen={isDetailsModalOpen}
                        onRequestClose={() => setIsDetailsModalOpen(false)}
                        eventDetails={eventDetails}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default HandleDates;
