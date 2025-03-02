import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DashboardPage from './DashboardPage';

const Dashboard = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardPage />
    </LocalizationProvider>
  );
};

export default Dashboard; 