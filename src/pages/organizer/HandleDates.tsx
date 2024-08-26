import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PriceDetailsModal from '../../components/organizer/PriceDetailsModal';
import EventDetailsModal from '../../components/organizer/EventDetailsModal';
import axiosInstance from '../../axios/axiosInterceptor';
import { Prices } from '../../types/prices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const [initialPrices, setInitialPrices] = useState<Prices>({
        dayPrice: '',
        nightPrice: '',
        fullDayPrice: ''
    });

    const organizerId = Cookies.get('OrganizerId');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/organizers/events`);
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
        };

        fetchEvents();
    }, []);

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
    
                const defaultDayPrice = 100;
                const defaultNightPrice = 80;
                const defaultFullDayPrice = 150;
    
                setInitialPrices({
                    dayPrice: existingPrices.dayPrice || defaultDayPrice,
                    nightPrice: existingPrices.nightPrice || defaultNightPrice,
                    fullDayPrice: existingPrices.fullDayPrice || defaultFullDayPrice,
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
                ...prices,
            });
            setIsModalOpen(false);
            toast.success('Prices updated successfully!')
        } catch (error) {
            console.error('Error saving prices:', error);
            toast.error('Failed to update prices. Please try again.');
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
            <div className="p-4 max-w-6xl mx-auto">
                <div className="text-lg font-bold mt-10 mb-4 text-center">
                    Manage Dates & Prices
                </div>
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
