import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer, Views, DateLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { API_BASE_URL } from '../../apiConfig';
import axiosInstance from '../../axios/axiosInterceptor';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
  type: 'day' | 'night' | 'full';
}

const events: Event[] = [
  {
    title: 'Full Day Booked',
    start: new Date(2024, 7, 21, 9, 0),
    end: new Date(2024, 7, 21, 23, 0),
    color: '#ef4444',
    type: 'full',
  },
  {
    title: 'Day Booked',
    start: new Date(2024, 7, 22, 9, 0),
    end: new Date(2024, 7, 22, 17, 0),
    color: '#3b82f6',
    type: 'day',
  },
  {
    title: 'Night Booked',
    start: new Date(2024, 7, 23, 18, 0),
    end: new Date(2024, 7, 23, 23, 0),
    color: '#f59e0b',
    type: 'night',
  },
];

const BookingCalendar: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    console.log(id,'organizer id')
    const [eventHallName, setEventHallName] = useState<string>('');

    useEffect(() =>{
        const fetchEventHallName = async () => {
            try {
                const response =  await axiosInstance.get(`${API_BASE_URL}/users/organizers/${id}`);
                setEventHallName(response.data);
            } catch (error) {
                console.error('Error fetching event hall name:', error);
            }
        };
        fetchEventHallName();
    }, [id]);

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

  const customDayPropGetter = (date: Date) => {
    const dayEvents = events.filter((event) =>
      moment(date).isSame(event.start, 'day')
    );

    const dayBooking = dayEvents.find((e) => e.type === 'day');
    const nightBooking = dayEvents.find((e) => e.type === 'night');
    const fullDayBooking = dayEvents.find((e) => e.type === 'full');

    if (fullDayBooking) {
      return { className: 'bg-red-200' };
    } else if (dayBooking && nightBooking) {
      return { className: 'bg-blue-200' };
    } else if (dayBooking) {
      return { className: 'bg-blue-100' };
    } else if (nightBooking) {
      return { className: 'bg-yellow-100' };
    }

    return {};
  };

  return (
    <>
    <Header/> 
    
    <div className="p-4 max-w-6xl mx-auto sm:h-screen">
    <div className="text-lg font-bold mt-10 mb-4 text-center">
           {eventHallName || 'Loading...'}
        </div>
    <div className="relative mt-14 h-[70vh] w-[70vw] mx-auto bg-blue-50 shadow-lg rounded-lg">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        // style={{ height: '70%' , width: '70%' }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={customDayPropGetter}
        views={['month', 'week', 'day']}
        formats={{
          eventTimeRangeFormat: (
            range: { start: Date; end: Date },
            culture: string | undefined
          ) =>
            localizer.format(
              {
                start: range.start,
                end: range.end,
              } as any,
              'HH:mm',
              culture
            ),
        }}
        className="text-sm sm:text-base"
      />
      </div>
    </div>
        <Footer />
    </>
  );
};

export default BookingCalendar;
