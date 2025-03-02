import React, { useState } from 'react';
import { Box, styled, MenuItem, TextField, Paper, Typography } from '@mui/material';
import AddTransaction from '../../components/AddTransaction/AddTransaction';

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

// Mock data - replace with actual data later
const mockTransactions = [
  {
    id: 1,
    type: 'cashOut' as const,
    amount: 1500,
    receiverName: 'John Doe',
    description: 'Monthly electricity bill',
    category: 'Bill',
    date: new Date(),
  },
  {
    id: 2,
    type: 'cashIn' as const,
    amount: 5000,
    receiverName: 'Jane Smith',
    description: 'Loan repayment',
    category: 'Loan',
    date: new Date(),
  },
];

const CategoryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const filteredTransactions = selectedCategory
    ? mockTransactions.filter(t => t.category === selectedCategory)
    : mockTransactions;

  const handleAddTransaction = (data: any) => {
    console.log('Category transaction:', data);
    setShowAddTransaction(false);
  };

  return (
    <PageContainer>
      <CategorySelector
        select
        label="Select Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </CategorySelector>

      <TransactionList>
        {filteredTransactions.map((transaction) => (
          <TransactionCard key={transaction.id}>
            <TransactionDetails>
              <Amount type={transaction.type}>
                {transaction.type === 'cashIn' ? '+' : '-'}₹{transaction.amount}
              </Amount>
              <Box>
                <Label>Receiver Name</Label>
                <Value>{transaction.receiverName}</Value>
              </Box>
              <Box>
                <Label>Description</Label>
                <Value>{transaction.description}</Value>
              </Box>
              <Box>
                <Label>Category</Label>
                <Value>{transaction.category}</Value>
              </Box>
              <Box>
                <Label>Date</Label>
                <Value>
                  {transaction.date.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Value>
              </Box>
            </TransactionDetails>
          </TransactionCard>
        ))}
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
