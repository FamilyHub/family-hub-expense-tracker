import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';

export type ViewType = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  gap: 4px;
  padding: 4px;
`;

const StyledToggleButton = styled(ToggleButton)`
  border: none !important;
  border-radius: 6px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  text-transform: none;
  font-weight: 500;
  padding: 4px 16px;

  &.Mui-selected {
    background: rgba(99, 102, 241, 0.8) !important;
    color: white !important;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface ViewSelectorProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ view, onViewChange }) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newView: ViewType | null) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box>
      <StyledToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChange}
        aria-label="view selector"
      >
        <StyledToggleButton value="all">All</StyledToggleButton>
        <StyledToggleButton value="daily">Daily</StyledToggleButton>
        <StyledToggleButton value="weekly">Weekly</StyledToggleButton>
        <StyledToggleButton value="monthly">Monthly</StyledToggleButton>
        <StyledToggleButton value="yearly">Yearly</StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default ViewSelector; 