import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { createTransaction } from '../services/api';

export const useTransactionHandler = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTransaction = async (transactionData: any) => {
    try {
      // Create the transaction
      await createTransaction(transactionData);
      
      // Show success message
      setShowSuccess(true);

      // Navigate immediately to cashbook
      navigate('/home/cashbook', { 
        replace: true,
        state: { shouldRefresh: true }
      });

      // Hide success message after delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

    } catch (error) {
      console.error('Error handling transaction:', error);
      setError('Failed to process transaction');
      setShowSuccess(false);
    }
  };

  return {
    handleAddTransaction,
    showSuccess,
    setShowSuccess,
    error
  };
}; 