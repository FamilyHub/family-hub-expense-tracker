import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Tabs, Tab, Fab, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Book as CashBookIcon,
  CalendarMonth as CalendarIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon
} from '@mui/icons-material';
import CashBookPage from '../../pages/CashBook/CashBookPage';
import CalendarPage from '../../pages/Calendar/CalendarPage';
import CategoryPage from '../../pages/Category/CategoryPage';
import Dashboard from '../../pages/Dashboard';
import AddTransaction from '../AddTransaction/AddTransaction';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className="relative"
    >
      {value === index && (
        <Box className="p-4">
          {children}
        </Box>
      )}
    </div>
  );
}

const StyledTabs = styled(Tabs)`
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .MuiTabs-indicator {
    height: 3px;
    background: linear-gradient(45deg, #6366f1, #4f46e5);
  }
`;

const StyledTab = styled(Tab)`
  color: rgba(255, 255, 255, 0.7);
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.Mui-selected {
    color: white;
  }

  .MuiSvgIcon-root {
    margin-bottom: 4px;
  }
`;

const tabPaths = ['cashbook', 'calendar', 'category', 'dashboard'];

const FloatingButton = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }
`;

const MoneyManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Set initial tab based on URL
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'cashbook';
    const index = tabPaths.indexOf(path);
    if (index !== -1) {
      setSelectedTab(index);
    }
  }, [location]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    navigate(`/home/${tabPaths[newValue]}`);
  };

  const handleAddTransaction = (data: {
    type: 'cashIn' | 'cashOut';
    amount: number;
    date: Date;
    category: string;
    receiverName: string;
    description: string;
  }) => {
    console.log('Transaction added:', data);
    setShowAddTransaction(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="relative">
        {/* Navigation Tabs */}
        <Paper elevation={0} sx={{ background: 'transparent' }}>
          <StyledTabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <StyledTab 
              icon={<CashBookIcon />} 
              label="CashBook" 
            />
            <StyledTab 
              icon={<CalendarIcon />} 
              label="Calendar" 
            />
            <StyledTab 
              icon={<CategoryIcon />} 
              label="Category" 
            />
            <StyledTab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
            />
          </StyledTabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={selectedTab} index={0}>
          <CashBookPage />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <CalendarPage />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <CategoryPage />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <Dashboard />
        </TabPanel>

        {/* Add Transaction Component */}
        <FloatingButton onClick={() => setShowAddTransaction(true)}>
          <AddIcon />
        </FloatingButton>

        <AddTransaction 
          open={showAddTransaction}
          onClose={() => setShowAddTransaction(false)}
          onAdd={handleAddTransaction} 
        />
      </Box>
    </LocalizationProvider>
  );
};

export default MoneyManager; 