import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import TransactionList, { TransactionListProps } from './TransactionList';
import FinancialSummary from './FinancialSummary';
import type { Dayjs } from 'dayjs';

const PageContainer = styled(Box)`
  display: flex;
  gap: 24px;
  height: 100%;
  padding: 24px;
`;

const MainContent = styled(Box)`
  flex: 1;
  min-width: 0; // Prevent flex item from overflowing
`;

const CashBook = (): JSX.Element => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleDateChange: TransactionListProps['onDateChange'] = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <PageContainer>
      <MainContent>
        <TransactionList onDateChange={handleDateChange} />
      </MainContent>
      <FinancialSummary startDate={startDate} endDate={endDate} />
    </PageContainer>
  );
};

export default CashBook; 