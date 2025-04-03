import React from 'react';
import { Tooltip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarEvent } from '../../services/eventService';
import dayjs from 'dayjs';

interface EventIndicatorProps {
  events: CalendarEvent[];
  date: Date;
  children: React.ReactNode; // Add children prop to wrap the date cell
}

const IndicatorDot = styled(Box)<{ completed?: boolean }>`
  width: 4px;
  height: 4px;
  background-color: ${props => props.completed ? '#4ade80' : '#6366f1'};
  border-radius: 50%;
  margin: 1px;
`;

const DotsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 80%;
`;

const EventList = styled(Box)`
  padding: 4px;
  font-size: 0.875rem;
  color: white;
`;

const EventItem = styled('div')`
  padding: 2px 0;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

// Separate component for tooltip content
const EventTooltipContent: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
  if (events.length === 0) {
    return <EventList>No events</EventList>;
  }

  return (
    <EventList>
      {events.map((event, index) => (
        <EventItem key={index}>{event.eventName}</EventItem>
      ))}
    </EventList>
  );
};

const EventIndicator: React.FC<EventIndicatorProps> = ({ events, date, children }) => {
  const dayEvents = events.filter(event => {
    const eventDate = dayjs(event.eventDate).startOf('day');
    const currentDate = dayjs(date).startOf('day');
    return eventDate.isSame(currentDate);
  });

  return (
    <Tooltip
      title={<EventTooltipContent events={dayEvents} />}
      arrow
      placement="top"
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
        {dayEvents.length > 0 && (
          <DotsContainer>
            {dayEvents.map((event, index) => (
              <IndicatorDot key={index} completed={event.eventCompleted} />
            ))}
          </DotsContainer>
        )}
      </Box>
    </Tooltip>
  );
};

export default EventIndicator; 