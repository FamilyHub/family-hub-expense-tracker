import axios, { AxiosError } from 'axios';
import { TransactionRequest, TransactionResponse } from '../types/transaction';
import dayjs from 'dayjs';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// Constants
const AUTH_TOKEN = 'test'; // In a real app, this would come from environment variables
const ORG_ID = 'ORG123'; // In a real app, this would come from environment variables or user context

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface Transaction {
  transactionId: string;
  category: string;
  receiverName: string;
  senderName: string;
  reason: string;
  amount: number;
  amountIn: boolean;
  customFields: {
    fieldKey: string;
    fieldValue: string;
    fieldValueType: string;
  }[];
  formattedDate?: string;
  formattedTime?: string;
}

export const fetchTransactions = async (startDate: number, endDate: number): Promise<Transaction[]> => {
  try {
    const response = await fetch(`http://localhost:8081/api/v1/financial/transactions?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const transactions: Transaction[] = await response.json();
    
    // Process each transaction to add formatted date and time
    return transactions.map(transaction => {
      const timestamp = transaction.customFields.find(field => 
        field.fieldKey === 'transaction-date' || field.fieldKey === 'lastactivity'
      )?.fieldValue;
      
      const date = dayjs(Number(timestamp));
      
      return {
        ...transaction,
        formattedDate: date.format('DD-MMM-YYYY'),
        formattedTime: date.format('hh:mm A'),
        income: transaction.amountIn ? transaction.amount : 0,
        expense: !transaction.amountIn ? transaction.amount : 0
      };
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const createTransaction = async (
  data: Omit<TransactionRequest, 'orgId'>
): Promise<TransactionResponse> => {
  try {
    const response = await axios.post<TransactionResponse>(
      `${API_BASE_URL}/transactions`,
      { ...data, orgId: ORG_ID },
      {
        headers: {
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new ApiError(
        `Failed to create transaction: ${message}`,
        status
      );
    }
    throw new ApiError('An unexpected error occurred while creating the transaction');
  }
};

export const fetchBalance = async (startDate: number, endDate: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/financial/balance?startDate=${startDate}&endDate=${endDate}`);
  if (!response.ok) {
    throw new Error('Failed to fetch balance');
  }
  return response.json();
};

export const fetchTotalIncome = async (startDate: number, endDate: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/financial/cash-in?startDate=${startDate}&endDate=${endDate}`);
  if (!response.ok) {
    throw new Error('Failed to fetch total income');
  }
  return response.json();
};

export const fetchTotalExpenses = async (startDate: number, endDate: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/financial/cash-out?startDate=${startDate}&endDate=${endDate}`);
  if (!response.ok) {
    throw new Error('Failed to fetch total expenses');
  }
  return response.json();
}; 