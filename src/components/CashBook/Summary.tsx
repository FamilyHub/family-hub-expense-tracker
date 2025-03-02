import React from 'react';
import { Box, Paper, Typography, styled } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const SummaryContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  padding: 16px;
  
  @media (min-width: 600px) {
    padding: 24px;
  }
`;

const SummaryCard = styled(Paper)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const IconContainer = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  svg {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const StyledTypography = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
`;

const Summary: React.FC = () => {
  // Sample data
  const summaryData = {
    balance: 5000,
    income: 10000,
    expense: 5000
  };

  return (
    <SummaryContainer>
      <SummaryCard elevation={0}>
        <CardContent>
          <IconContainer style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
            <AccountBalanceWalletIcon sx={{ color: '#4ade80 !important' }} />
          </IconContainer>
          <Box>
            <StyledTypography variant="body2" sx={{ opacity: 0.7 }}>
              Current Balance
            </StyledTypography>
            <StyledTypography variant="h5">
              ₹{summaryData.balance}
            </StyledTypography>
          </Box>
        </CardContent>
      </SummaryCard>

      <SummaryCard elevation={0}>
        <CardContent>
          <IconContainer style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
            <TrendingUpIcon sx={{ color: '#4ade80 !important' }} />
          </IconContainer>
          <Box>
            <StyledTypography variant="body2" sx={{ opacity: 0.7 }}>
              Total Income
            </StyledTypography>
            <StyledTypography variant="h5">
              ₹{summaryData.income}
            </StyledTypography>
          </Box>
        </CardContent>
      </SummaryCard>

      <SummaryCard elevation={0}>
        <CardContent>
          <IconContainer style={{ background: 'rgba(248, 113, 113, 0.1)' }}>
            <TrendingDownIcon sx={{ color: '#f87171 !important' }} />
          </IconContainer>
          <Box>
            <StyledTypography variant="body2" sx={{ opacity: 0.7 }}>
              Total Expense
            </StyledTypography>
            <StyledTypography variant="h5">
              ₹{summaryData.expense}
            </StyledTypography>
          </Box>
        </CardContent>
      </SummaryCard>
    </SummaryContainer>
  );
};

export default Summary;
