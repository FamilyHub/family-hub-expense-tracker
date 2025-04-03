import React from 'react';
import { Box, styled, Typography, Paper } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const ChartContainer = styled(Paper)`
  padding: 24px;
  height: 100%;
  min-height: 400px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const ChartTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  height: calc(100% - 48px);
`;

const StatCard = styled(Paper)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const MemberName = styled(Typography)`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
`;

const NotificationCount = styled(Box)`
  display: flex;
  gap: 24px;
`;

const CountBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CountValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const CountLabel = styled(Typography)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

interface NotificationStats {
  read: number;
  unread: number;
}

interface NotificationsData {
  father: NotificationStats;
  mother: NotificationStats;
  grandfather: NotificationStats;
  brother: NotificationStats;
}

interface NotificationsDashboardProps {
  data: NotificationsData;
}

const NotificationsDashboard: React.FC<NotificationsDashboardProps> = ({ data }) => {
  return (
    <ChartContainer>
      <ChartTitle>
        <NotificationsIcon />
        Notifications Status
      </ChartTitle>
      <StatsContainer>
        <StatCard>
          <MemberName>Father</MemberName>
          <NotificationCount>
            <CountBox>
              <CountValue>{data.father.read}</CountValue>
              <CountLabel>Read</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{data.father.unread}</CountValue>
              <CountLabel>Unread</CountLabel>
            </CountBox>
          </NotificationCount>
        </StatCard>

        <StatCard>
          <MemberName>Mother</MemberName>
          <NotificationCount>
            <CountBox>
              <CountValue>{data.mother.read}</CountValue>
              <CountLabel>Read</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{data.mother.unread}</CountValue>
              <CountLabel>Unread</CountLabel>
            </CountBox>
          </NotificationCount>
        </StatCard>

        <StatCard>
          <MemberName>Grandfather</MemberName>
          <NotificationCount>
            <CountBox>
              <CountValue>{data.grandfather.read}</CountValue>
              <CountLabel>Read</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{data.grandfather.unread}</CountValue>
              <CountLabel>Unread</CountLabel>
            </CountBox>
          </NotificationCount>
        </StatCard>

        <StatCard>
          <MemberName>Brother</MemberName>
          <NotificationCount>
            <CountBox>
              <CountValue>{data.brother.read}</CountValue>
              <CountLabel>Read</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{data.brother.unread}</CountValue>
              <CountLabel>Unread</CountLabel>
            </CountBox>
          </NotificationCount>
        </StatCard>
      </StatsContainer>
    </ChartContainer>
  );
};

export default NotificationsDashboard; 