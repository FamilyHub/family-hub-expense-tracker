import React, { useState } from 'react';
import { Box, styled, MenuItem, TextField, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import AddTransaction from '../../components/AddTransaction/AddTransaction';
import { useCategory } from '../../hooks/useCategory';
import { Transaction } from '../../services/transactionService';
import dayjs from 'dayjs';

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
  padding: 16px;
  gap: 16px;
`;

const CategorySelector = styled(TextField)`
  .MuiOutlinedInput-root {
    background: rgba(30, 30, 30, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    color: white;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.1);
    }

    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.2);
    }

    &.Mui-focused fieldset {
      border-color: #6366f1;
    }
  }

  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }

  .MuiSelect-icon {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const TransactionList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionCard = styled(Paper)`
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  color: white;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
`;

const TransactionDetails = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Amount = styled(Typography)<{ type: 'cashIn' | 'cashOut' }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.type === 'cashIn' ? '#4ade80' : '#f87171'};
`;

const Label = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const Value = styled(Typography)`
  color: white;
  font-weight: 500;
`;

const categories = [
  'Bill',
  'Shopping',
  'Betting',
  'Loan',
  'EMIs',
];

const CategoryPage: React.FC = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const {
    transactions,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    refreshTransactions
  } = useCategory();

  const handleAddTransaction = async (data: any) => {
    console.log('Category transaction:', data);
    setShowAddTransaction(false);
    // Refresh transactions after adding a new one
    refreshTransactions();
  };

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

  return (
    <PageContainer>
      <CategorySelector
        select
        label="Select Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
      >
        <MenuItem value="All Categories">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </CategorySelector>

      <TransactionList>
        {transactions.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
            No transactions found for {selectedCategory}
          </Typography>
        ) : (
          transactions.map((transaction) => (
            <TransactionCard key={transaction.transactionId}>
              <TransactionDetails>
                <Amount type={transaction.amountIn ? 'cashIn' : 'cashOut'}>
                  {transaction.amountIn ? '+' : '-'}₹{transaction.amount}
                </Amount>
                <Box>
                  <Label>Receiver Name</Label>
                  <Value>{transaction.receiverName}</Value>
                </Box>
                <Box>
                  <Label>Description</Label>
                  <Value>{transaction.reason}</Value>
                </Box>
                <Box>
                  <Label>Category</Label>
                  <Value>{transaction.category}</Value>
                </Box>
                <Box>
                  <Label>Date</Label>
                  <Value>{getTransactionDate(transaction)}</Value>
                </Box>
              </TransactionDetails>
            </TransactionCard>
          ))
        )}
      </TransactionList>

      <AddTransaction 
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={handleAddTransaction} 
      />
    </PageContainer>
  );
};

export default CategoryPage;
