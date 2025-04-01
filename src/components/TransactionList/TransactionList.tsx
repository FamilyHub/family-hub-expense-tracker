import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  styled,
  CircularProgress,
  Alert
} from '@mui/material';
import { Transaction, fetchTransactions, fetchTransactionsByCategory } from '../../services/transactionService';
import dayjs from 'dayjs';

interface TransactionListProps {
  selectedCategory: string;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: 'rgba(30, 41, 59, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
}));

const TransactionList: React.FC<TransactionListProps> = ({ selectedCategory }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = selectedCategory === 'All Categories'
          ? await fetchTransactions()
          : await fetchTransactionsByCategory(selectedCategory);
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [selectedCategory]);

  const getTransactionDate = (transaction: Transaction) => {
    const lastActivityField = transaction.customFields.find(field => field.fieldKey === 'lastactivity');
    if (lastActivityField) {
      return dayjs(parseInt(lastActivityField.fieldValue)).format('MMM D, YYYY');
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No transactions found for {selectedCategory}
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {transactions.map((transaction) => (
        <StyledListItem key={transaction.transactionId}>
          <ListItemIcon>
            <Chip
              label={transaction.amountIn ? 'IN' : 'OUT'}
              color={transaction.amountIn ? 'success' : 'error'}
              size="small"
              sx={{
                minWidth: '60px',
                fontWeight: 'bold',
                bgcolor: transaction.amountIn ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: transaction.amountIn ? '#4ade80' : '#ef4444',
                border: `1px solid ${transaction.amountIn ? '#4ade80' : '#ef4444'}`,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  {transaction.receiverName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: transaction.amountIn ? '#4ade80' : '#ef4444',
                    fontWeight: 'bold',
                  }}
                >
                  {transaction.amountIn ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {transaction.reason}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={transaction.category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      border: '1px solid #6366f1',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {getTransactionDate(transaction)}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </StyledListItem>
      ))}
    </List>
  );
};

export default TransactionList; 