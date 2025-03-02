import React from 'react';
import { Box, Tab, Tabs, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AccountBalanceWallet as WalletIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const StyledTabs = styled(Tabs)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  .MuiTabs-indicator {
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(45deg, #6366f1, #ec4899);
  }
`;

const StyledTab = styled(Tab)`
  text-transform: none;
  font-weight: 600;
  min-height: 48px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.Mui-selected {
    color: white;
  }
  
  .MuiSvgIcon-root {
    margin-right: 8px;
  }
`;

const TabContainer = styled(Box)`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
`;

const TabPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTabValue = () => {
    if (location.pathname.includes('calendar')) return 1;
    if (location.pathname.includes('category')) return 2;
    if (location.pathname.includes('dashboard')) return 3;
    return 0;
  };

  const [value, setValue] = React.useState(getTabValue());

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/calendar');
        break;
      case 2:
        navigate('/category');
        break;
      case 3:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <TabContainer className="animate-slide-in">
      <StyledTabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="navigation tabs"
      >
        <StyledTab icon={<WalletIcon />} label="Cash Book" />
        <StyledTab icon={<CalendarIcon />} label="Calendar" />
        <StyledTab icon={<CategoryIcon />} label="Category" />
        <StyledTab icon={<DashboardIcon />} label="Dashboard" />
      </StyledTabs>
    </TabContainer>
  );
};

export default TabPanel;
