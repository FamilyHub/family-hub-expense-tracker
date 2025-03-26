import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  styled,
  Tab,
  Tabs,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createTransaction } from '../../services/api';

const categories = [
  'Bill',
  'Shopping',
  'Betting',
  'Loan',
  'EMIs',
];

interface FormData {
  type: number;
  amount: string;
  receiverName: string;
  description: string;
  date: Dayjs | null;
  category: string;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    min-width: 360px;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 24px;
  
  .MuiTabs-indicator {
    background-color: #6366f1;
  }
`;

const StyledTab = styled(Tab)`
  color: rgba(255, 255, 255, 0.7) !important;
  
  &.Mui-selected {
    color: white !important;
  }
`;

const FormField = styled(Box)`
  margin-bottom: 20px;

  .MuiTextField-root {
    width: 100%;
  }

  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }

  .MuiOutlinedInput-root {
    color: white;
    
    fieldset {
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.Mui-focused fieldset {
      border-color: #6366f1;
    }
  }

  .MuiSelect-icon {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ActionButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 8px;
`;

interface AddTransactionProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (data: {
    type: 'cashIn' | 'cashOut';
    amount: number;
    date: Date;
    category: string;
    receiverName: string;
    description: string;
  }) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState<FormData>({
    type: 0,
    amount: '',
    receiverName: '',
    description: '',
    date: dayjs(),
    category: categories[0],
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const resetForm = () => {
    setFormData({
      type: 0,
      amount: '',
      receiverName: '',
      description: '',
      date: dayjs(),
      category: categories[0],
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleAlertClose = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.date || !isValid) return;

    setLoading(true);
    try {
      const isCashIn = formData.type === 0;
      
      // Get current timestamp for lastactivity
      const currentTimestamp = Date.now();
      
      // Get selected date's timestamp for transaction-date
      const selectedDate = formData.date.valueOf();
      
      const transactionData = {
        category: formData.category,
        customFields: [
          {
            fieldKey: 'transaction-date',
            fieldValue: selectedDate.toString(),
            fieldValueType: 'STRING'
          },
          {
            fieldKey: 'lastactivity',
            fieldValue: currentTimestamp.toString(),
            fieldValueType: 'STRING'
          }
        ],
        receiverName: isCashIn ? '' : formData.receiverName,
        senderName: isCashIn ? formData.receiverName : '',
        reason: formData.description,
        amount: parseFloat(formData.amount),
        updates: [],
        amountIn: isCashIn,
        orgId: 'ORG123'
      };

      const response = await createTransaction(transactionData);
      
      setAlert({
        open: true,
        message: 'Transaction added successfully',
        severity: 'success'
      });

      if (onAdd) {
        onAdd({
          type: isCashIn ? 'cashIn' : 'cashOut',
          amount: parseFloat(formData.amount),
          date: formData.date.toDate(),
          category: formData.category,
          receiverName: formData.receiverName,
          description: formData.description,
        });
      }
      handleClose();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      setAlert({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to create transaction',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.amount && formData.date && formData.category && formData.receiverName;

  return (
    <>
      <StyledDialog open={open} onClose={handleClose}>
        <StyledDialogTitle>Add Transaction</StyledDialogTitle>
        
        <DialogContent>
          <StyledTabs
            value={formData.type}
            onChange={(_, newValue: number) => handleChange('type', newValue)}
            variant="fullWidth"
          >
            <StyledTab label="Cash In" />
            <StyledTab label="Cash Out" />
          </StyledTabs>

          <FormField>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Enter amount"
            />
          </FormField>

          <FormField>
            <TextField
              label={formData.type === 0 ? "Sender Name" : "Receiver Name"}
              value={formData.receiverName}
              onChange={(e) => handleChange('receiverName', e.target.value)}
              placeholder={formData.type === 0 ? "Enter sender name" : "Enter receiver name"}
            />
          </FormField>

          <FormField>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
              multiline
              rows={2}
            />
          </FormField>

          <FormField>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(newDate: Dayjs | null) => handleChange('date', newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                }
              }}
            />
          </FormField>

          <FormField>
            <TextField
              select
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </FormField>
        </DialogContent>

        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <ActionButton 
            onClick={handleClose}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            disabled={loading}
          >
            Cancel
          </ActionButton>
          <ActionButton 
            onClick={handleSubmit}
            disabled={!isValid || loading}
            sx={{
              background: isValid ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                background: isValid ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' : 'rgba(255, 255, 255, 0.15)'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Transaction'
            )}
          </ActionButton>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddTransaction;
