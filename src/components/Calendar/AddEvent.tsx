import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set timezone to India
dayjs.tz.setDefault("Asia/Kolkata");

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    min-width: 400px;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;

  .MuiTextField-root, .MuiFormControl-root {
    .MuiOutlinedInput-root {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      
      .MuiOutlinedInput-notchedOutline {
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: rgba(255, 255, 255, 0.2);
      }
      
      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #6366f1;
      }
    }

    .MuiInputLabel-root {
      color: rgba(255, 255, 255, 0.7);
      
      &.Mui-focused {
        color: #6366f1;
      }
    }
  }
`;

const StyledDialogActions = styled(DialogActions)`
  padding: 16px 24px;
  background-color: rgba(255, 255, 255, 0.05);
`;

export interface EventData {
  eventName: string;
  eventDate: Dayjs | null;
  eventTime: Dayjs | null;
  isAllowedToSendNotification: boolean;
  isParentAllowedToSeeThis: boolean;
}

interface AddEventProps {
  open: boolean;
  onClose: () => void;
  onAdd: (eventData: EventData) => void;
  selectedDate?: Date | null;
}

const AddEvent: React.FC<AddEventProps> = ({ open, onClose, onAdd, selectedDate }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<Dayjs | null>(
    selectedDate ? dayjs(selectedDate).tz("Asia/Kolkata") : null
  );
  const [eventTime, setEventTime] = useState<Dayjs | null>(null);
  const [allowNotification, setAllowNotification] = useState('no');
  const [parentVisibility, setParentVisibility] = useState('no');

  const handleSubmit = () => {
    const eventData: EventData = {
      eventName,
      eventDate: eventDate ? eventDate.tz("Asia/Kolkata") : null,
      eventTime: eventTime ? eventTime.tz("Asia/Kolkata") : null,
      isAllowedToSendNotification: allowNotification === 'yes',
      isParentAllowedToSeeThis: parentVisibility === 'yes'
    };
    onAdd(eventData);
    handleClose();
  };

  const handleClose = () => {
    setEventName('');
    setEventDate(null);
    setEventTime(null);
    setAllowNotification('no');
    setParentVisibility('no');
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDialog open={open} onClose={handleClose}>
        <StyledDialogTitle>Add New Event</StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            label="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            fullWidth
            required
          />

          <DatePicker
            label="Event Date"
            value={eventDate}
            onChange={(newDate) => setEventDate(newDate)}
            timezone="Asia/Kolkata"
            slotProps={{
              textField: {
                fullWidth: true,
                required: true
              }
            }}
          />
          
          <TimePicker
            label="Event Time"
            value={eventTime}
            onChange={(newTime) => setEventTime(newTime)}
            timezone="Asia/Kolkata"
            slotProps={{
              textField: {
                fullWidth: true,
                required: true
              }
            }}
            views={['hours', 'minutes']}
            format="hh:mm a"
          />

          <FormControl fullWidth>
            <InputLabel>Allow Notifications</InputLabel>
            <Select
              value={allowNotification}
              onChange={(e) => setAllowNotification(e.target.value)}
              label="Allow Notifications"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Parent Visibility</InputLabel>
            <Select
              value={parentVisibility}
              onChange={(e) => setParentVisibility(e.target.value)}
              label="Parent Visibility"
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </StyledDialogContent>
        
        <StyledDialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!eventName || !eventDate || !eventTime}
          >
            Save
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </LocalizationProvider>
  );
};

export default AddEvent; 