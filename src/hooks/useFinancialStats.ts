import { useState, useEffect } from 'react';
import { fetchBalance, fetchTotalIncome, fetchTotalExpenses } from '../services/api';
import dayjs from 'dayjs';

interface FinancialStats {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  loading: boolean;
  error: string | null;
}

export const useFinancialStats = (startDate: dayjs.Dayjs | null, endDate: dayjs.Dayjs | null) => {
  const [stats, setStats] = useState<FinancialStats>({
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        let startTimestamp: number;
        let endTimestamp: number;

        if (startDate && endDate) {
          startTimestamp = startDate.startOf('day').valueOf();
          endTimestamp = endDate.endOf('day').valueOf();
        } else {
          const now = dayjs().tz('Asia/Kolkata');
          startTimestamp = now.startOf('day').valueOf();
          endTimestamp = now.endOf('day').valueOf();
        }

        const [balance, income, expenses] = await Promise.all([
          fetchBalance(startTimestamp, endTimestamp),
          fetchTotalIncome(startTimestamp, endTimestamp),
          fetchTotalExpenses(startTimestamp, endTimestamp)
        ]);

        setStats({
          balance,
          totalIncome: income,
          totalExpenses: expenses,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch financial statistics'
        }));
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  return stats;
}; 