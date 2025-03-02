import React from 'react';
import { Box, Typography, Paper, styled } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TransactionContainer = styled(Box)`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const ListContainer = styled(Paper)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderRow = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TransactionItem = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 16px;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  &:active {
    transform: scale(0.99);
  }
`;

const StyledTypography = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  animation: fadeIn 0.5s ease-out;
`;

// Sample transaction data
const transactions = [
  { id: 1, date: '2025-02-16', income: 1000, expense: 0 },
  { id: 2, date: '2025-02-16', income: 0, expense: 500 },
];

const TransactionList: React.FC = () => {
  return (
    <TransactionContainer className="slide-up">
      <ListContainer>
        <HeaderRow>
          <StyledTypography variant="subtitle1">Date</StyledTypography>
          <StyledTypography variant="subtitle1" sx={{ color: '#4ade80' }}>Income</StyledTypography>
          <StyledTypography variant="subtitle1" sx={{ color: '#f87171' }}>Expense</StyledTypography>
        </HeaderRow>
        
        {transactions.length > 0 ? (
          <TransitionGroup>
            {transactions.map((transaction) => (
              <CSSTransition
                key={transaction.id}
                timeout={300}
                classNames="list-item"
              >
                <TransactionItem>
                  <StyledTypography>{transaction.date}</StyledTypography>
                  <StyledTypography sx={{ color: '#4ade80' }}>
                    {transaction.income > 0 ? `₹${transaction.income}` : '-'}
                  </StyledTypography>
                  <StyledTypography sx={{ color: '#f87171' }}>
                    {transaction.expense > 0 ? `₹${transaction.expense}` : '-'}
                  </StyledTypography>
                </TransactionItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        ) : (
          <EmptyState>
            <StyledTypography variant="h6" gutterBottom>
              No transactions yet
            </StyledTypography>
            <StyledTypography variant="body2">
              Add your first transaction using the buttons below
            </StyledTypography>
          </EmptyState>
        )}
      </ListContainer>
    </TransactionContainer>
  );
};

export default TransactionList;
