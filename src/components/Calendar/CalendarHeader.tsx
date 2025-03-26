import React from 'react';
import { Box, styled } from '@mui/material';
import { ChevronLeft, ChevronRight, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface CalendarHeaderProps {
  dateRangeText: string;
  onPrevious: () => void;
  onNext: () => void;
  onAddEvent: () => void;
  onRemoveEvent: () => void;
}

const HeaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin: 16px;
`;

const DateNavigator = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(99, 102, 241, 0.05);
  color: white;
`;

const NavSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled(Box)`
  color: rgba(255, 255, 255, 0.7);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
    color: white;
  }
`;

const ActionButton = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;

  &.add {
    background: rgba(74, 222, 128, 0.1);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, 0.2);

    &:hover {
      background: rgba(74, 222, 128, 0.2);
      border-color: rgba(74, 222, 128, 0.3);
    }
  }

  &.remove {
    background: rgba(248, 113, 113, 0.1);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.2);

    &:hover {
      background: rgba(248, 113, 113, 0.2);
      border-color: rgba(248, 113, 113, 0.3);
    }
  }
`;

const DateRange = styled(Box)`
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  dateRangeText,
  onPrevious,
  onNext,
  onAddEvent,
  onRemoveEvent,
}) => {
  return (
    <HeaderContainer>
      <DateNavigator>
        <NavSection>
          <NavButton onClick={onPrevious}>
            <ChevronLeft />
          </NavButton>
          <DateRange>
            {dateRangeText}
          </DateRange>
          <NavButton onClick={onNext}>
            <ChevronRight />
          </NavButton>
        </NavSection>
        <NavSection>
          <ActionButton className="add" onClick={onAddEvent}>
            <AddIcon fontSize="small" />
            Add Event
          </ActionButton>
          <ActionButton className="remove" onClick={onRemoveEvent}>
            <DeleteIcon fontSize="small" />
            Remove Event
          </ActionButton>
        </NavSection>
      </DateNavigator>
    </HeaderContainer>
  );
};

export default CalendarHeader; 