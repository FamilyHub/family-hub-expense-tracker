import { useState, useEffect, useMemo } from 'react';
import { fetchTransactions } from '../services/transactionService';
import { Transaction } from '../types/transaction';
import dayjs, { Dayjs } from 'dayjs';

interface CategoryPercentage {
  category: string;
  amount: number;
  percentage: number;
}

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const useDashboardData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(30, 'days'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [categoryData, setCategoryData] = useState<CategoryPercentage[]>([]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryPercentages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8081/api/v1/transactions/category-percentage?startDate=${startDate.valueOf()}&endDate=${endDate.valueOf()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch category percentages');
      }

      const data = await response.json();
      setCategoryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category percentages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    loadCategoryPercentages();
  }, [startDate, endDate]);

  const stats = useMemo(() => {
    const filteredTransactions = transactions.filter(t => {
      const lastActivityField = t.customFields.find(field => field.fieldKey === 'lastactivity');
      if (!lastActivityField) return false;
      const transactionDate = dayjs(parseInt(lastActivityField.fieldValue));
      return transactionDate.isAfter(startDate) && transactionDate.isBefore(endDate);
    });

    const totalIncome = filteredTransactions
      .filter(t => t.amountIn)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => !t.amountIn)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }, [transactions, startDate, endDate]);

  return {
    transactions,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    stats,
    categoryData
  };
}; 