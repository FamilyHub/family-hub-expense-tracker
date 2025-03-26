import { useState, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Transaction } from '../services/api';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the timezone to local timezone
dayjs.tz.guess();

interface UseTransactionFilterResult {
  filteredTransactions: Transaction[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
}

export const useTransactionFilter = (transactions: Transaction[]): UseTransactionFilterResult => {
  // Initialize with today's date in local timezone
  const today = dayjs().tz();
  const [startDate, setStartDate] = useState<Dayjs | null>(today.startOf('day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(today.endOf('day'));

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = dayjs(transaction.formattedDate, 'DD-MMM-YYYY').tz();
        return transactionDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }

    // Always sort by date and time, newest first
    return filtered.sort((a, b) => {
      const dateA = dayjs(a.formattedDate + ' ' + a.formattedTime, 'DD-MMM-YYYY hh:mm A').tz();
      const dateB = dayjs(b.formattedDate + ' ' + b.formattedTime, 'DD-MMM-YYYY hh:mm A').tz();
      return dateB.valueOf() - dateA.valueOf();
    });
  }, [transactions, startDate, endDate]);

  return {
    filteredTransactions,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}; 