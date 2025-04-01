import { useState, useEffect } from 'react';
import { Transaction, fetchTransactions, fetchTransactionsByCategory } from '../services/transactionService';

export const useCategory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const loadTransactions = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = category === 'All Categories'
        ? await fetchTransactions()
        : await fetchTransactionsByCategory(category);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(selectedCategory);
  }, [selectedCategory]);

  return {
    transactions,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    refreshTransactions: () => loadTransactions(selectedCategory)
  };
}; 