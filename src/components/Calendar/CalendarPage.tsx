import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { CalendarEvent, updateEvent, fetchMonthEvents } from '../../services/eventService';
import EditEventDialog from '../Calendar/EditEventDialog';
import EventListDialog from '../Calendar/EventListDialog';
import dayjs from 'dayjs';

interface CustomField {
  fieldKey: string;
  fieldValue: string | null;
  fieldValueType: string;
}

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadMonthEvents = async (date: dayjs.Dayjs) => {
    try {
      const startDate = date.startOf('month').valueOf();
      const endDate = date.endOf('month').valueOf();
      const response = await fetchMonthEvents(startDate, endDate);
      setEvents(response);
    } catch (error) {
      console.error('Error loading events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load events',
        severity: 'error'
      });
    }
  };

  // Load events when currentDate changes
  useEffect(() => {
    loadMonthEvents(currentDate);
  }, [currentDate]);

  const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
    try {
      const eventData = {
        eventName: updatedEvent.eventName,
        eventDate: updatedEvent.eventDate,
        eventTime: updatedEvent.customFields.find((field: CustomField) => field.fieldKey === "eventTime")?.fieldValue || "00:00"
      };
      
      const response = await updateEvent(updatedEvent.eventId, eventData);
      if (response.eventId) {
        setShowEditEvent(false);
        setShowEventList(false);
        setSelectedEvent(null);

        setSnackbar({
          open: true,
          message: 'Changes updated successfully',
          severity: 'success'
        });

        await loadMonthEvents(currentDate);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update event',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMarkCompleted = async (updatedEvent: CalendarEvent) => {
    // Only update local state, don't trigger a server refresh
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.eventId === updatedEvent.eventId ? updatedEvent : event
      )
    );

    setSnackbar({
      open: true,
      message: `Event marked as ${updatedEvent.eventCompleted ? 'completed' : 'not completed'}`,
      severity: 'success'
    });
  };

  return (
    <div className="calendar-container">
      <EditEventDialog
        open={showEditEvent}
        onClose={() => {
          setShowEditEvent(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleUpdateEvent}
      />

      <EventListDialog
        open={showEventList}
        onClose={() => {
          setShowEventList(false);
          setSelectedEvent(null);
        }}
        events={events || []}
        selectedDate={currentDate.toDate()}
        onEditEvent={(event) => {
          setSelectedEvent(event);
          setShowEditEvent(true);
        }}
        onMarkCompleted={handleMarkCompleted}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}; 