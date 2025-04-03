import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, styled, keyframes } from '@mui/material';
import { Dayjs } from 'dayjs';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import axios from 'axios';

interface FinancialStatsProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const StatsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 24px;
  padding: 4px;
`;

const StatsCard = styled(Card)`
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(22, 28, 36, 0.95) 0%,
    rgba(26, 32, 44, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 50%,
      transparent 100%
    );
    transition: all 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

    &::before {
      left: 100%;
    }
  }
`;

const CardHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled(Box)`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 18px;
    border: 2px solid transparent;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
`;

const ContentBox = styled(Box)`
  flex: 1;
`;

const StatLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
`;

const LoadingValue = styled(Box)`
  height: 2.5rem;
  width: 150px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const FinancialStats: React.FC<FinancialStatsProps> = ({ startDate, endDate }) => {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialStats = async () => {
      if (!startDate || !endDate) return;

      setIsLoading(true);
      try {
        const [balanceRes, incomeRes, expensesRes] = await Promise.all([
          axios.get(`/api/v1/financial/balance?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`),
          axios.get(`/api/v1/financial/cash-in?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`),
          axios.get(`/api/v1/financial/cash-out?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`)
        ]);

        setCurrentBalance(balanceRes.data);
        setTotalIncome(incomeRes.data);
        setTotalExpenses(expensesRes.data);
      } catch (error) {
        console.error('Error fetching financial stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialStats();
  }, [startDate, endDate]);

  return (
    <StatsContainer>
      <StatsCard>
        <CardHeader>
          <IconWrapper 
            sx={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
            }}
          >
            <AccountBalanceWalletIcon 
              sx={{ 
                color: '#818cf8', 
                fontSize: 32,
                filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.3))'
              }} 
            />
          </IconWrapper>
          <ContentBox>
            <StatLabel>Current Balance</StatLabel>
            {isLoading ? (
              <LoadingValue />
            ) : (
              <StatValue>
                {currentBalance !== null ? formatCurrency(currentBalance) : 'N/A'}
              </StatValue>
            )}
          </ContentBox>
        </CardHeader>
      </StatsCard>

      <StatsCard>
        <CardHeader>
          <IconWrapper 
            sx={{ 
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.25) 100%)',
            }}
          >
            <TrendingUpIcon 
              sx={{ 
                color: '#4ade80', 
                fontSize: 32,
                filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))'
              }} 
            />
          </IconWrapper>
          <ContentBox>
            <StatLabel>Total Income</StatLabel>
            {isLoading ? (
              <LoadingValue />
            ) : (
              <StatValue sx={{ color: '#4ade80' }}>
                {totalIncome !== null ? formatCurrency(totalIncome) : 'N/A'}
              </StatValue>
            )}
          </ContentBox>
        </CardHeader>
      </StatsCard>

      <StatsCard>
        <CardHeader>
          <IconWrapper 
            sx={{ 
              background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.15) 0%, rgba(248, 113, 113, 0.25) 100%)',
            }}
          >
            <TrendingDownIcon 
              sx={{ 
                color: '#f87171', 
                fontSize: 32,
                filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.3))'
              }} 
            />
          </IconWrapper>
          <ContentBox>
            <StatLabel>Total Expenses</StatLabel>
            {isLoading ? (
              <LoadingValue />
            ) : (
              <StatValue sx={{ color: '#f87171' }}>
                {totalExpenses !== null ? formatCurrency(totalExpenses) : 'N/A'}
              </StatValue>
            )}
          </ContentBox>
        </CardHeader>
      </StatsCard>
    </StatsContainer>
  );
};

export default FinancialStats; 