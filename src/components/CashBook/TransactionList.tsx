import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Paper, styled, CircularProgress, Fab, Snackbar, Alert } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { fetchTransactions, Transaction } from '../../services/api';
import DateRangePicker from '../shared/DateRangePicker';
import { useTransactionFilter } from '../../hooks/useTransactionFilter';
import AddTransaction from '../AddTransaction/AddTransaction';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTransactionHandler } from '../../hooks/useTransactionHandler';
import AddTransactionButton from '../shared/AddTransactionButton';
import type { Dayjs } from 'dayjs';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
// Set the default timezone to IST
dayjs.tz.setDefault('Asia/Kolkata');

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

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
`;

const DateTimeContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DateText = styled(StyledTypography)`
  font-size: 0.9rem;
  font-weight: 500;
`;

const TimeText = styled(StyledTypography)`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const FilterContainer = styled(Box)`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;
`;

const AddButton = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  &:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }
`;

export interface TransactionListProps {
  onDateChange?: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
}

const TransactionList = ({ onDateChange }: TransactionListProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    handleAddTransaction,
    showSuccess,
    setShowSuccess,
    error: transactionError
  } = useTransactionHandler();

  const {
    filteredTransactions,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useTransactionFilter(transactions);

  // Function to load today's transactions
  const loadTodayTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const now = dayjs().tz('Asia/Kolkata');
      const startTimestamp = now.startOf('day').valueOf();
      const endTimestamp = now.endOf('day').valueOf();
      
      const data = await fetchTransactions(startTimestamp, endTimestamp);
      setTransactions(data);
      setError(null);
      
      // Reset date filters to today
      setStartDate(now);
      setEndDate(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [setStartDate, setEndDate]);

  // Function to load transactions for selected date range
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let startTimestamp: number;
      let endTimestamp: number;

      if (startDate && endDate) {
        startTimestamp = dayjs(startDate).startOf('day').valueOf();
        endTimestamp = dayjs(endDate).endOf('day').valueOf();
      } else {
        const now = dayjs().tz('Asia/Kolkata');
        startTimestamp = now.startOf('day').valueOf();
        endTimestamp = now.endOf('day').valueOf();
      }
      
      const data = await fetchTransactions(startTimestamp, endTimestamp);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Load transactions when component mounts or when navigation state changes
  useEffect(() => {
    const state = location.state as { shouldRefresh?: boolean } | null;
    
    if (state?.shouldRefresh) {
      loadTodayTransactions();
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    } else {
      loadTransactions();
    }
  }, [location, loadTodayTransactions, loadTransactions, navigate]);

  // Add effect to call onDateChange when dates change
  useEffect(() => {
    onDateChange?.(startDate, endDate);
  }, [startDate, endDate, onDateChange]);

  const handleTransactionAdd = async (transactionData: any) => {
    setIsAddDialogOpen(false);
    await handleAddTransaction(transactionData);
  };

  const formatAmount = (amount: number) => {
    return amount > 0 ? `₹${amount.toFixed(2)}` : '-';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <StyledTypography variant="h6" gutterBottom>
          Error loading transactions
        </StyledTypography>
        <StyledTypography variant="body2">
          {error}
        </StyledTypography>
      </EmptyState>
    );
  }

  return (
    <>
      <TransactionContainer className="slide-up">
        <FilterContainer>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </FilterContainer>

        <ListContainer>
          <HeaderRow>
            <StyledTypography variant="subtitle1">Date & Time</StyledTypography>
            <StyledTypography variant="subtitle1" sx={{ color: '#4ade80' }}>Income</StyledTypography>
            <StyledTypography variant="subtitle1" sx={{ color: '#f87171' }}>Expense</StyledTypography>
          </HeaderRow>
          
          {filteredTransactions.length > 0 ? (
            <TransitionGroup>
              {filteredTransactions.map((transaction) => (
                <CSSTransition
                  key={transaction.transactionId}
                  timeout={300}
                  classNames="list-item"
                >
                  <TransactionItem>
                    <DateTimeContainer>
                      <DateText>{transaction.formattedDate}</DateText>
                      <TimeText>{transaction.formattedTime}</TimeText>
                    </DateTimeContainer>
                    <StyledTypography sx={{ color: '#4ade80' }}>
                      {formatAmount(transaction.amountIn ? transaction.amount : 0)}
                    </StyledTypography>
                    <StyledTypography sx={{ color: '#f87171' }}>
                      {formatAmount(!transaction.amountIn ? transaction.amount : 0)}
                    </StyledTypography>
                  </TransactionItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          ) : (
            <EmptyState>
              <StyledTypography variant="h6" gutterBottom>
                No transactions found
              </StyledTypography>
              <StyledTypography variant="body2">
                Try adjusting your date range or add new transactions
              </StyledTypography>
            </EmptyState>
          )}
        </ListContainer>
      </TransactionContainer>

      <AddTransactionButton />

      <AddTransaction
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleTransactionAdd}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Transaction added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionList;
