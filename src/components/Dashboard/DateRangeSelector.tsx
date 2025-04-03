import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const DateRangeContainer = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 32px;

  .MuiTextField-root {
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(30, 30, 30, 0.4) 100%);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    min-width: 200px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
    }

    .MuiOutlinedInput-root {
      color: white;
      
      fieldset {
        border-color: rgba(255, 255, 255, 0.1);
        transition: border-color 0.3s ease;
      }

      &:hover fieldset {
        border-color: rgba(99, 102, 241, 0.5);
      }

      &.Mui-focused fieldset {
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
      }
    }

    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const DateRangeLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 8px;
`;

interface DateRangeSelectorProps {
  startDate: Dayjs;
  endDate: Dayjs;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <Box>
      <DateRangeLabel>Select Date Range</DateRangeLabel>
      <DateRangeContainer>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
          maxDate={endDate}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small"
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small"
            }
          }}
        />
      </DateRangeContainer>
    </Box>
  );
};

export default DateRangeSelector; 