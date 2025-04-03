import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  styled
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarEvent } from '../../services/eventService';
import dayjs from 'dayjs';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onSave: (updatedEvent: CalendarEvent) => void;
}

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
`;

const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onClose,
  event,
  onSave
}) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (event) {
      setEventName(event.eventName);
      setEventDate(dayjs(event.eventDate));
    }
  }, [event]);

  const handleSave = () => {
    if (event && eventDate) {
      onSave({
        ...event,
        eventName,
        eventDate: eventDate.valueOf()
      });
      onClose();
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Edit Event
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Event Date & Time"
              value={eventDate}
              onChange={(newValue) => setEventDate(newValue)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: '#6366f1',
            '&:hover': {
              bgcolor: '#4f46e5',
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditEventDialog; 