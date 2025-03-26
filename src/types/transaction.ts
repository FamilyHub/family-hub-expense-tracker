export interface CustomField {
  fieldKey: string;
  fieldValue: string;
  fieldValueType: string;
}

export interface TransactionRequest {
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

export interface TransactionResponse {
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