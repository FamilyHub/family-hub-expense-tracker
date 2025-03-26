import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import TransactionList from './TransactionList';
import FinancialStats from './FinancialStats';
import { Dayjs } from 'dayjs';

const Container = styled(Box)`
  display: flex;
  gap: 24px;
  height: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  min-width: 0; // Prevents flex child from overflowing
`;

const SideContent = styled(Box)`
  width: 320px;
  flex-shrink: 0;
`;

const CashBook: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleDateChange = (start: Dayjs | null, end: Dayjs | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Container>
      <MainContent>
        <TransactionList onDateChange={handleDateChange} />
      </MainContent>
      <SideContent>
        <FinancialStats startDate={startDate} endDate={endDate} />
      </SideContent>
    </Container>
  );
};

export default CashBook; 