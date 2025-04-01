import React, { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { enIN } from 'date-fns/locale';
import MonthCalendar from '../../components/Calendar/MonthCalendar';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import AddTransaction from '../../components/AddTransaction/AddTransaction';
import AddEvent, { EventData } from '../../components/Calendar/AddEvent';
import { addEvent, fetchMonthEvents, CalendarEvent, updateEvent, updateEventStatus } from '../../services/eventService';
import EventListDialog from '../../components/Calendar/EventListDialog';
import EditEventDialog from '../../components/Calendar/EditEventDialog';
import dayjs from 'dayjs';
import RemoveEventsDialog from '../../components/Calendar/RemoveEventsDialog';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
`;

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventList, setShowEventList] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
  const [showRemoveEvents, setShowRemoveEvents] = useState(false);

  const loadMonthEvents = async (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthEvents = await fetchMonthEvents(start.getTime(), end.getTime());
    setEvents(monthEvents);
  };

  useEffect(() => {
    loadMonthEvents(currentDate);
  }, [currentDate]);

  const handlePrevious = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowAddTransaction(true);
  };

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  const handleRemoveEvent = () => {
    setShowRemoveEvents(true);
  };

  const handleEventsDeleted = () => {
    // Refresh events after deletion
    loadMonthEvents(currentDate);
  };

  const handleEventSave = async (eventData: EventData) => {
    try {
      await addEvent(eventData);
      console.log('Event saved successfully');
      setShowAddEvent(false);
      setSelectedDate(null);
      // Reload events after adding a new one
      loadMonthEvents(currentDate);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dayEvents = events.filter(event => {
      const eventDate = dayjs(event.eventDate).startOf('day');
      const currentDate = dayjs(day).startOf('day');
      return eventDate.isSame(currentDate);
    });
    setSelectedDateEvents(dayEvents);
    setShowEventList(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEditEvent(true);
  };

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    try {
      // Format the event data to match the expected type
      const eventData = {
        eventName: updatedEvent.eventName,
        eventDate: updatedEvent.eventDate,
        eventTime: updatedEvent.customFields.find(field => field.fieldKey === "eventTime")?.fieldValue || "00:00"
      };
      
      await updateEvent(updatedEvent.eventId, eventData);
      // Refresh events after update
      loadMonthEvents(currentDate);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleMarkCompleted = (updatedEvent: CalendarEvent) => {
    // Only update the local state
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
    
    // Also update selectedDateEvents to reflect the change immediately
    setSelectedDateEvents(prevEvents =>
      prevEvents.map(event =>
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );
  };

  const dateRangeText = format(currentDate, 'MMMM yyyy', { locale: enIN });

  return (
    <PageContainer>
      <CalendarHeader
        dateRangeText={dateRangeText}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onAddEvent={handleAddEvent}
        onRemoveEvent={handleRemoveEvent}
      />

      <MonthCalendar 
        currentDate={currentDate}
        onSelectDate={handleDayClick}
        selectedDate={selectedDate}
        events={events}
      />

      <EventListDialog
        open={showEventList}
        onClose={() => setShowEventList(false)}
        events={selectedDateEvents}
        selectedDate={selectedDate || new Date()}
        onEditEvent={handleEditEvent}
        onMarkCompleted={handleMarkCompleted}
      />

      <EditEventDialog
        open={showEditEvent}
        onClose={() => {
          setShowEditEvent(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleUpdateEvent}
      />

      <RemoveEventsDialog
        open={showRemoveEvents}
        onClose={() => setShowRemoveEvents(false)}
        onEventsDeleted={handleEventsDeleted}
      />

      <AddTransaction 
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={(data) => {
          console.log('Calendar transaction:', data);
          setShowAddTransaction(false);
          setSelectedDate(null);
        }}
      />

      <AddEvent 
        open={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        selectedDate={selectedDate}
        onAdd={handleEventSave}
      />
    </PageContainer>
  );
};

export default CalendarPage;
