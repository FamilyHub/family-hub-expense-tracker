import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface CalendarDayProps {
  isToday: boolean;
  isCurrentMonth: boolean;
}

const CalendarContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const WeekDayHeader = styled(Box)`
  padding: 12px;
  text-align: center;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
`;

const CalendarDay = styled(Box)<CalendarDayProps>`
  aspect-ratio: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isToday ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.isToday ? 'rgba(99, 102, 241, 0.3)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .day-number {
    color: ${props => props.isCurrentMonth ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
    font-weight: ${props => props.isToday ? '600' : '400'};
    font-size: 0.875rem;
  }
`;

interface MonthCalendarProps {
  currentDate: Date;
  onSelectDate?: (date: Date) => void;
}

export default function MonthCalendar({ currentDate, onSelectDate }: MonthCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      {days.map(day => (
        <CalendarDay
          key={day.toISOString()}
          isToday={isToday(day)}
          isCurrentMonth={isSameMonth(day, currentDate)}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{format(day, 'd')}</span>
        </CalendarDay>
      ))}
    </CalendarContainer>
  );
}
