import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import AddEvent, { EventData } from './AddEvent';

interface EventManagerProps {
  selectedDate: Date | null;
}

const EventManager: React.FC<EventManagerProps> = ({ selectedDate }) => {
  const [showAddEvent, setShowAddEvent] = useState(false);

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  return (
    <>
      <AddEvent 
        open={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        selectedDate={selectedDate}
        onAdd={(eventData: EventData) => {
          console.log('Calendar event:', eventData);
          setShowAddEvent(false);
        }}
      />
    </>
  );
};

export default EventManager; 