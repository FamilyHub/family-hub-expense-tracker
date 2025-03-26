import React from 'react';
import { Box, styled } from '@mui/material';
import { startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { CalendarEvent } from '../../services/eventService';
import EventIndicator from './EventIndicator';

interface CalendarDayProps {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
  events: CalendarEvent[];
}

const CalendarContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  margin: 0 16px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const WeekDayHeader = styled(Box)`
  padding: 8px 4px;
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DayCell = styled(Box)<{ isToday: boolean; isSelected: boolean; isCurrentMonth: boolean; isCurrentYear: boolean }>`
  aspect-ratio: 1.5;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: ${props => 
    props.isSelected 
      ? 'rgba(99, 102, 241, 0.2)' 
      : props.isToday 
        ? 'rgba(99, 102, 241, 0.1)' 
        : 'transparent'
  };
  border: 1px solid ${props => 
    props.isSelected 
      ? 'rgba(99, 102, 241, 0.3)' 
      : props.isToday 
        ? 'rgba(99, 102, 241, 0.2)' 
        : 'transparent'
  };

  &:hover {
    background: ${props => 
      props.isSelected 
        ? 'rgba(99, 102, 241, 0.3)' 
        : 'rgba(255, 255, 255, 0.05)'
    };
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DayNumber = styled('span')<{ isCurrentMonth: boolean; isSelected: boolean }>`
  color: ${props => 
    props.isCurrentMonth 
      ? props.isSelected
        ? '#fff'
        : 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(255, 255, 255, 0.3)'
  };
  font-weight: ${props => props.isSelected ? '600' : '400'};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
`;

const CalendarDay: React.FC<CalendarDayProps> = ({ date, isToday, isSelected, onClick, events }) => {
  const isCurrentMonth = date.getMonth() === new Date().getMonth();
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();

  return (
    <EventIndicator events={events} date={date}>
      <DayCell
        onClick={onClick}
        isToday={isToday}
        isSelected={isSelected}
        isCurrentMonth={isCurrentMonth}
        isCurrentYear={isCurrentYear}
      >
        <DayNumber isCurrentMonth={isCurrentMonth} isSelected={isSelected}>
          {date.getDate()}
        </DayNumber>
      </DayCell>
    </EventIndicator>
  );
};

interface MonthCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate?: (date: Date) => void;
  events?: CalendarEvent[];
}

export default function MonthCalendar({ currentDate, selectedDate, onSelectDate, events = [] }: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the start of the week for the first day of the month
  const calendarStart = startOfWeek(monthStart, { locale: enIN });
  // Get the end of the week for the last day of the month
  const calendarEnd = endOfWeek(monthEnd, { locale: enIN });
  
  // Generate all days that should be shown on the calendar
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayClick = (day: Date) => {
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  return (
    <CalendarContainer>
      {weekDays.map(day => (
        <WeekDayHeader key={day}>{day}</WeekDayHeader>
      ))}
      {calendarDays.map(day => (
        <CalendarDay
          key={day.toISOString()}
          date={day}
          isToday={isToday(day)}
          isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
          onClick={() => handleDayClick(day)}
          events={events}
        />
      ))}
    </CalendarContainer>
  );
}
