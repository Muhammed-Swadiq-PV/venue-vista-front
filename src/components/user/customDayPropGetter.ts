import moment from 'moment';

interface Event {
  start: Date;
  type: 'day' | 'night' | 'full';
}

const customDayPropGetter = (date: Date, events: Event[]) => {
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

export default customDayPropGetter;

// disable selection of past days from booking
