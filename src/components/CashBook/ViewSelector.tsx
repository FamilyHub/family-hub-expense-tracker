import React from 'react';
import { Box, Button, styled } from '@mui/material';
import { APP_CONSTANTS } from '../../constants/app.constants';

interface ViewButtonProps {
  isSelected: boolean;
}

const ViewSelectorContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  backdrop-filter: blur(10px);
`;

const ViewButton = styled(Button)<ViewButtonProps>`
  color: white;
  background-color: ${props => props.isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border-radius: 20px;
  text-transform: none;
  min-width: auto;
  padding: 6px 16px;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

interface ViewSelectorProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ selectedView, onViewChange }) => {
  const views = ['All', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

  return (
    <ViewSelectorContainer>
      {views.map((view) => (
        <ViewButton
          key={view}
          isSelected={selectedView === view}
          onClick={() => onViewChange(view)}
        >
          {view}
        </ViewButton>
      ))}
    </ViewSelectorContainer>
  );
};

export default ViewSelector;
