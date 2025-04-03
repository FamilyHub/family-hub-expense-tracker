import React from 'react';
import { Box, TextField, styled } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const StyledDatePicker = styled(DatePicker)`
  .MuiTextField-root {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.9);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  .MuiIconButton-root {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const DatePickerContainer = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: center;
`;

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerContainer>
        <StyledDatePicker
          label="Start Date"
          value={startDate}
          onChange={(newDate) => onStartDateChange(newDate)}
          maxDate={endDate || undefined}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
        <StyledDatePicker
          label="End Date"
          value={endDate}
          onChange={(newDate) => onEndDateChange(newDate)}
          minDate={startDate || undefined}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
      </DatePickerContainer>
    </LocalizationProvider>
  );
};

export default DateRangePicker; 