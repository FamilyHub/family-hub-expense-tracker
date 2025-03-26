import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, styled } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const SummaryContainer = styled(Box)`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const StatCard = styled(Paper)`
  background: rgba(22, 28, 36, 0.95);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const IconContainer = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const StatLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const StatValue = styled(Typography)`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

interface FinancialSummaryProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ startDate, endDate }) => {
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const start = startDate?.startOf('day').valueOf() || dayjs().startOf('day').valueOf();
        const end = endDate?.endOf('day').valueOf() || dayjs().endOf('day').valueOf();

        const baseUrl = 'http://localhost:8081/api/v1/financial';
        const [balanceRes, incomeRes, expensesRes] = await Promise.all([
          fetch(`${baseUrl}/balance?startDate=${start}&endDate=${end}`),
          fetch(`${baseUrl}/cash-in?startDate=${start}&endDate=${end}`),
          fetch(`${baseUrl}/cash-out?startDate=${start}&endDate=${end}`)
        ]);

        const [balanceData, incomeData, expensesData] = await Promise.all([
          balanceRes.json(),
          incomeRes.json(),
          expensesRes.json()
        ]);

        setBalance(balanceData);
        setIncome(incomeData);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SummaryContainer>
      <StatCard>
        <IconContainer sx={{ background: 'rgba(99, 102, 241, 0.2)' }}>
          <AccountBalanceWalletIcon sx={{ color: '#4ade80', fontSize: 24 }} />
        </IconContainer>
        <Box>
          <StatLabel>Current Balance</StatLabel>
          <StatValue>
            {loading ? '...' : formatCurrency(balance)}
          </StatValue>
        </Box>
      </StatCard>

      <StatCard>
        <IconContainer sx={{ background: 'rgba(74, 222, 128, 0.2)' }}>
          <TrendingUpIcon sx={{ color: '#4ade80', fontSize: 24 }} />
        </IconContainer>
        <Box>
          <StatLabel>Total Income</StatLabel>
          <StatValue>
            {loading ? '...' : formatCurrency(income)}
          </StatValue>
        </Box>
      </StatCard>

      <StatCard>
        <IconContainer sx={{ background: 'rgba(248, 113, 113, 0.2)' }}>
          <TrendingDownIcon sx={{ color: '#f87171', fontSize: 24 }} />
        </IconContainer>
        <Box>
          <StatLabel>Total Expense</StatLabel>
          <StatValue>
            {loading ? '...' : formatCurrency(expenses)}
          </StatValue>
        </Box>
      </StatCard>
    </SummaryContainer>
  );
};

export default FinancialSummary; 