import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { API_BASE_URL } from '../../apiConfig';
import axiosInstance from '../../axios/axiosInterceptor';
import useAuthRedirect from '../../axios/useAuthRedirect';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
  type: 'day' | 'night' | 'full';
}

const BookingCalendar: React.FC = () => {
  useAuthRedirect();

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [eventHallName, setEventHallName] = useState<string>('');
  const [organizerId , setOrganizerId] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEventHallName = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/users/organizers/${id}`);
        setOrganizerId(response.data.organizerId);
        setEventHallName(response.data.organizerName);
      } catch (error) {
        console.error('Error fetching event hall name:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/users/events/${organizerId}`);
        const fetchedEvents = response.data.map((event: any) => ({
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          type: event.type,
          color: event.type === 'full' ? '#ef4444' : event.type === 'day' ? '#3b82f6' : '#f59e0b',
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEventHallName();
    fetchEvents();
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
    const today = moment().startOf('day');
    const isPastDay = moment(date).isBefore(today, 'day');

    if (isPastDay) {
      return { className: 'bg-gray-200 cursor-not-allowed' };
    }

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

  const handleDateClick = (date: Date) => {
    const today = moment().startOf('day');
    if (moment(date).isBefore(today, 'day')) {
      return;
    }

    navigate(`/user/booking-details/${organizerId}`, {
      state: { selectedDate: date },
    });
  };

  const handleDateSelection = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      handleDateClick(date); 
    }
  };

  return (
    <ErrorBoundary>
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow p-4 max-w-6xl mx-auto">
        <div className="text-lg font-bold mt-10 mb-4 text-center">
          {eventHallName || 'Loading...'}
        </div>
        <div className="flex justify-center mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelection}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select a date"
            className="border p-2 rounded"
          />
        </div>
        <div className="relative mt-14 h-[70vh] w-[60vw] mx-auto bg-blue-50 shadow-lg rounded-lg">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={({ start }) => handleDateClick(start)}
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
      </div>
    </ErrorBoundary>
  );
};

export default BookingCalendar;
