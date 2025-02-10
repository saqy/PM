import React, { useState } from 'react';
import { PMCalendar } from '../components/PMCalendar';
import { Event } from '../types';
import { mockEvents } from '../utils/mockData';

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const handleEventAdd = (event: Event) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  return (
    <div>
      <PMCalendar 
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
      />
    </div>
  );
};

export default Calendar; 