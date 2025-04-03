import React, { useState } from 'react';
import { Fab, Snackbar, Alert, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddTransaction from '../AddTransaction/AddTransaction';
import { useTransactionHandler } from '../../hooks/useTransactionHandler';

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

const AddTransactionButton: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {
    handleAddTransaction,
    showSuccess,
    setShowSuccess,
    error
  } = useTransactionHandler();

  const handleTransactionAdd = async (transactionData: any) => {
    try {
      setIsAddDialogOpen(false);
      // Ensure we wait for the transaction to be handled
      await handleAddTransaction(transactionData);
    } catch (err) {
      console.error('Failed to add transaction:', err);
      setShowSuccess(false);
    }
  };

  return (
    <>
      <AddButton onClick={() => setIsAddDialogOpen(true)}>
        <AddIcon />
      </AddButton>

      <AddTransaction
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setShowSuccess(false);
        }}
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

export default AddTransactionButton; 