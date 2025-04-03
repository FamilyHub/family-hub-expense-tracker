import React, { useState, useMemo } from 'react';
import { Box, styled, Typography, CircularProgress, Alert, Grid, Paper, useTheme } from '@mui/material';
import { 
  AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, LineChart, Line
} from 'recharts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DateRangeSelector from '../../components/Dashboard/DateRangeSelector';
import CategoryDistributionChart from '../../components/Dashboard/CategoryDistributionChart';
import { EventDetailsChart } from '../../components/Dashboard/EventDetailsChart';
import NotificationsDashboard from '../../components/Dashboard/NotificationsDashboard';
import MonthlyExpensesChart from '../../components/Dashboard/MonthlyExpensesChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';

const PageContainer = styled(Box)`
  padding: 32px;
  background: #0f172a;
  min-height: 100vh;
  color: white;
`;

const ChartContainer = styled(Paper)`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  min-height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
`;

const StatsContainer = styled(Grid)`
  margin-bottom: 32px;
`;

const CategoryChartWrapper = styled(Box)`
  height: 100%;
  min-height: 400px;
`;

const RightColumnWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const EventStatusWrapper = styled(Box)`
  height: 200px;
  width: 100%;
`;

const NotificationsWrapper = styled(Box)`
  height: calc(100% - 224px);
  width: 100%;
`;

const StatCard = styled(Paper)`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StatValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  margin-top: 8px;
  background: linear-gradient(45deg, #6366f1, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChartHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartSubtitle = styled(Typography)`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TradingChartContainer = styled(Box)`
  height: 200px;
  position: relative;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const DashboardPage: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    stats,
    categoryData
  } = useDashboardData();

  const [eventStats, setEventStats] = useState<{ completed: number; pending: number }>({ completed: 0, pending: 0 });
  const [eventLoading, setEventLoading] = useState(false);

  const theme = useTheme();

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      setEndDate(date);
    }
  };

  // Fetch event status when dates change
  React.useEffect(() => {
    const fetchEventStatus = async () => {
      if (!startDate || !endDate) return;
      
      setEventLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8081/api/v1/events/status?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        setEventStats({
          completed: data.completedEventIds.length,
          pending: data.pendingEventIds.length
        });
      } catch (err) {
        console.error('Error fetching event status:', err);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEventStatus();
  }, [startDate, endDate]);

  // Prepare data for area chart (cumulative balance)
  const balanceData = useMemo(() => {
    let balance = 0;
    return transactions
      .sort((a, b) => {
        const dateA = dayjs(a.customFields.find(f => f.fieldKey === 'lastactivity')?.fieldValue);
        const dateB = dayjs(b.customFields.find(f => f.fieldKey === 'lastactivity')?.fieldValue);
        return dateA.diff(dateB);
      })
      .map(t => {
        balance += t.amountIn ? t.amount : -t.amount;
        return {
          date: dayjs(t.customFields.find(f => f.fieldKey === 'lastactivity')?.fieldValue).format('MMM DD'),
          balance
        };
      });
  }, [transactions]);

  const notificationData = {
    father: { read: 0, unread: 0 },
    mother: { read: 0, unread: 0 },
    grandfather: { read: 0, unread: 0 },
    brother: { read: 0, unread: 0 }
  };

  // Monthly expenses data with multiple years
  const monthlyExpensesData = [
    // 2022
    { month: 'Jan 2022', expenses: 10000 },
    { month: 'Feb 2022', expenses: 12000 },
    { month: 'Mar 2022', expenses: 11000 },
    { month: 'Apr 2022', expenses: 13000 },
    { month: 'May 2022', expenses: 12500 },
    { month: 'Jun 2022', expenses: 14000 },
    { month: 'Jul 2022', expenses: 13500 },
    { month: 'Aug 2022', expenses: 15000 },
    { month: 'Sep 2022', expenses: 14500 },
    { month: 'Oct 2022', expenses: 16000 },
    { month: 'Nov 2022', expenses: 15500 },
    { month: 'Dec 2022', expenses: 17000 },
    // 2023
    { month: 'Jan 2023', expenses: 12000 },
    { month: 'Feb 2023', expenses: 15000 },
    { month: 'Mar 2023', expenses: 18000 },
    { month: 'Apr 2023', expenses: 14000 },
    { month: 'May 2023', expenses: 16000 },
    { month: 'Jun 2023', expenses: 19000 },
    { month: 'Jul 2023', expenses: 17000 },
    { month: 'Aug 2023', expenses: 21000 },
    { month: 'Sep 2023', expenses: 20000 },
    { month: 'Oct 2023', expenses: 23000 },
    { month: 'Nov 2023', expenses: 25000 },
    { month: 'Dec 2023', expenses: 28000 },
    // 2024
    { month: 'Jan 2024', expenses: 22000 },
    { month: 'Feb 2024', expenses: 24000 },
    { month: 'Mar 2024', expenses: 26000 },
    { month: 'Apr 2024', expenses: 23000 },
    { month: 'May 2024', expenses: 25000 },
    { month: 'Jun 2024', expenses: 27000 },
    { month: 'Jul 2024', expenses: 24000 },
    { month: 'Aug 2024', expenses: 26000 },
    { month: 'Sep 2024', expenses: 28000 },
    { month: 'Oct 2024', expenses: 25000 },
    { month: 'Nov 2024', expenses: 27000 },
    { month: 'Dec 2024', expenses: 29000 },
    // 2025 (Projected)
    { month: 'Jan 2025', expenses: 26000 },
    { month: 'Feb 2025', expenses: 28000 },
    { month: 'Mar 2025', expenses: 30000 },
    { month: 'Apr 2025', expenses: 27000 },
    { month: 'May 2025', expenses: 29000 },
    { month: 'Jun 2025', expenses: 31000 },
    { month: 'Jul 2025', expenses: 28000 },
    { month: 'Aug 2025', expenses: 30000 },
    { month: 'Sep 2025', expenses: 32000 },
    { month: 'Oct 2025', expenses: 29000 },
    { month: 'Nov 2025', expenses: 31000 },
    { month: 'Dec 2025', expenses: 33000 }
  ];

  const totalExpenses = monthlyExpensesData.reduce((sum, data) => sum + data.expenses, 0);
  const averageExpenses = totalExpenses / monthlyExpensesData.length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'An error occurred while loading the dashboard data.'}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PageContainer>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />

        <StatsContainer container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: '#4ade80' }} />
                <StatLabel>Total Income</StatLabel>
              </Box>
              <StatValue>₹{stats.totalIncome.toLocaleString()}</StatValue>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDownIcon sx={{ color: '#f87171' }} />
                <StatLabel>Total Expenses</StatLabel>
              </Box>
              <StatValue>₹{stats.totalExpenses.toLocaleString()}</StatValue>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ color: stats.balance >= 0 ? '#4ade80' : '#f87171' }} />
                <StatLabel>Balance</StatLabel>
              </Box>
              <StatValue sx={{ 
                background: stats.balance >= 0 
                  ? 'linear-gradient(45deg, #4ade80, #22c55e)' 
                  : 'linear-gradient(45deg, #f87171, #ef4444)'
              }}>
                ₹{stats.balance.toLocaleString()}
              </StatValue>
            </StatCard>
          </Grid>
        </StatsContainer>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ChartContainer>
              <CategoryChartWrapper>
                <CategoryDistributionChart data={categoryData} />
              </CategoryChartWrapper>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} md={7}>
            <RightColumnWrapper>
              <EventStatusWrapper>
                <EventDetailsChart data={eventStats} loading={eventLoading} />
              </EventStatusWrapper>
              <NotificationsWrapper>
                <NotificationsDashboard data={notificationData} />
              </NotificationsWrapper>
            </RightColumnWrapper>
          </Grid>

          <Grid item xs={12}>
            <ChartContainer>
              <MonthlyExpensesChart 
                data={monthlyExpensesData}
                totalExpenses={totalExpenses}
                averageExpenses={averageExpenses}
              />
            </ChartContainer>
          </Grid>
        </Grid>
      </PageContainer>
    </LocalizationProvider>
  );
};

export default DashboardPage;
