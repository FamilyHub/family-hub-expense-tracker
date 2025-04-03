import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { keyframes } from '@emotion/react';

const ChartContainer = styled(Paper)`
  padding: 8px;
  height: 100%;
  min-height: 80px;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const ChartTitle = styled(Typography)`
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  height: calc(100% - 16px);
`;

const StatCard = styled(Paper)<{ type: 'completed' | 'pending' }>`
  padding: 8px;
  background: ${props => props.type === 'completed' 
    ? 'rgba(74, 222, 128, 0.1)' 
    : 'rgba(248, 113, 113, 0.1)'};
  border: 1px solid ${props => props.type === 'completed' 
    ? 'rgba(74, 222, 128, 0.2)' 
    : 'rgba(248, 113, 113, 0.2)'};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.type === 'completed' 
      ? 'linear-gradient(45deg, rgba(74, 222, 128, 0.1), transparent)' 
      : 'linear-gradient(45deg, rgba(248, 113, 113, 0.1), transparent)'};
    z-index: 0;
  }
`;

const StatIcon = styled(Box)<{ type: 'completed' | 'pending' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  background: ${props => props.type === 'completed' 
    ? 'rgba(74, 222, 128, 0.2)' 
    : 'rgba(248, 113, 113, 0.2)'};
  color: ${props => props.type === 'completed' ? '#4ade80' : '#f87171'};
  position: relative;
  z-index: 1;
`;

const StatValue = styled(Typography)`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
`;

const StatLabel = styled(Typography)`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
`;

interface EventDetailsChartProps {
  data: {
    completed: number;
    pending: number;
  };
  loading?: boolean;
}

export const EventDetailsChart: React.FC<EventDetailsChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <ChartContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography color="white">Loading event details...</Typography>
        </Box>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle>
        <EventNoteIcon /> Event Status
      </ChartTitle>
      <StatsContainer>
        <StatCard type="completed">
          <StatIcon type="completed">
            <CheckCircleIcon sx={{ fontSize: 32 }} />
          </StatIcon>
          <StatValue>{data.completed}</StatValue>
          <StatLabel>Completed Events</StatLabel>
        </StatCard>
        <StatCard type="pending">
          <StatIcon type="pending">
            <PendingActionsIcon sx={{ fontSize: 32 }} />
          </StatIcon>
          <StatValue>{data.pending}</StatValue>
          <StatLabel>Pending Events</StatLabel>
        </StatCard>
      </StatsContainer>
    </ChartContainer>
  );
};