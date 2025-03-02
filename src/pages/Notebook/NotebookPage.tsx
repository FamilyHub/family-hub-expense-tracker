import React, { useState } from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { formatDateRange, getDateRangeForView, getNextDate, getPreviousDate } from '../../utils/dateUtils';
import AddTransaction from '../../components/AddTransaction/AddTransaction';

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

const ViewSelector = styled(Box)`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(99, 102, 241, 0.1);
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ViewButton = styled(Box)<{ selected?: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  background-color: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  color: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'transparent'};

  &:hover {
    background-color: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.2);
  }
`;

const DateNavigator = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(99, 102, 241, 0.05);
  color: white;
`;

const NavButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.7);
  padding: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
    color: white;
  }
`;

const DateRange = styled(Typography)`
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
`;

const NotebookPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState('Monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const views = ['All', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setCurrentDate(new Date());
  };

  const handlePrevious = () => {
    setCurrentDate(prev => getPreviousDate(prev, selectedView));
  };

  const handleNext = () => {
    setCurrentDate(prev => getNextDate(prev, selectedView));
  };

  const dateRange = getDateRangeForView(currentDate, selectedView);
  const dateRangeText = formatDateRange(dateRange.start, dateRange.end);

  return (
    <PageContainer>
      <HeaderContainer>
        <ViewSelector>
          {views.map((view) => (
            <ViewButton
              key={view}
              selected={selectedView === view}
              onClick={() => handleViewChange(view)}
            >
              {view}
            </ViewButton>
          ))}
        </ViewSelector>
        <DateNavigator>
          <NavButton onClick={handlePrevious}>
            <ChevronLeft />
          </NavButton>
          <DateRange variant="subtitle1">
            {dateRangeText}
          </DateRange>
          <NavButton onClick={handleNext}>
            <ChevronRight />
          </NavButton>
        </DateNavigator>
      </HeaderContainer>
      <AddTransaction
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={(data) => {
          console.log('Notebook transaction:', data);
          setShowAddTransaction(false);
        }}
      />
    </PageContainer>
  );
};

export default NotebookPage;
