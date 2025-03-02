import React, { useState } from 'react';
import { Box } from '@mui/material';
import ViewSelector from './ViewSelector';
import Summary from './Summary';
import TransactionList from './TransactionList';

const CashBook: React.FC = () => {
  const [selectedView, setSelectedView] = useState('All');

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  return (
    <Box className="space-y-4">
      <ViewSelector selectedView={selectedView} onViewChange={handleViewChange} />
      <Summary />
      <TransactionList />
    </Box>
  );
};

export default CashBook; 