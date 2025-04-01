import { API_ENDPOINTS } from '../config/api';

export interface Transaction {
  transactionId: string;
  category: string;
  customFields: CustomField[];
  receiverName: string;
  senderName: string;
  reason: string;
  amount: number;
  orgId: string;
  updates: any[];
  amountIn: boolean;
}

export interface CustomField {
  fieldKey: string;
  fieldValue: string;
  fieldValueType: string;
}

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.transactions.base, {
      headers: {
        'Authorization': 'test',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchTransactionsByCategory = async (category: string): Promise<Transaction[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.transactions.byCategory(category), {
      headers: {
        'Authorization': 'test',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions by category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions by category:', error);
    throw error;
  }
}; 