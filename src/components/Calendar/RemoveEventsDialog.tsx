import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Typography,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarEvent, getEventsByDateRange, bulkDeleteEvents } from '../../services/eventService';
import dayjs, { Dayjs } from 'dayjs';

interface RemoveEventsDialogProps {
  open: boolean;
  onClose: () => void;
  onEventsDeleted: () => void;
}

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
`;

const RemoveEventsDialog: React.FC<RemoveEventsDialogProps> = ({
  open,
  onClose,
  onEventsDeleted
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset all state when dialog closes
  const handleClose = () => {
    setSelectedDate(null);
    setEvents([]);
    setSelectedEventIds([]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleDateChange = async (date: Dayjs | null) => {
    if (!date) return;
    
    setSelectedDate(date);
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const startOfDay = date.startOf('day').valueOf();
      const endOfDay = date.endOf('day').valueOf();
      const dateEvents = await getEventsByDateRange(startOfDay, endOfDay);
      setEvents(dateEvents);
      setSelectedEventIds([]);
    } catch (err) {
      setError('Failed to fetch events for the selected date');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventId: string) => {
    setSelectedEventIds(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      }
      return [...prev, eventId];
    });
  };

  const handleDeleteEvents = async () => {
    if (selectedEventIds.length === 0) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bulkDeleteEvents(selectedEventIds);
      
      if (response.failureList.length > 0) {
        setError(`Failed to delete ${response.failureList.length} events`);
      }
      
      if (response.successList.length > 0) {
        setSuccess(`Successfully deleted ${response.successList.length} events`);
        onEventsDeleted();
        
        // Remove deleted events from the list
        const deletedIds = new Set(response.successList.map(event => event.eventId));
        setEvents(prev => prev.filter(event => !deletedIds.has(event.eventId)));
        setSelectedEventIds([]);
      }
    } catch (err) {
      setError('Failed to delete events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Remove Events
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)' }}>
              {success}
            </Alert>
          )}

          {events.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ color: 'white', mt: 2 }}>
                Select events to remove:
              </Typography>
              <List>
                {events.map((event) => (
                  <ListItem
                    key={event.eventId}
                    dense
                    onClick={() => handleToggleEvent(event.eventId)}
                    sx={{
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedEventIds.includes(event.eventId)}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.3)',
                          '&.Mui-checked': {
                            color: '#6366f1',
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: 'white' }}>
                          {event.eventName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {dayjs(event.eventDate).format('h:mm A')}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {events.length === 0 && selectedDate && !loading && (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', p: 2 }}>
              No events found for this date
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button 
          onClick={handleClose}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeleteEvents}
          disabled={selectedEventIds.length === 0 || loading}
          variant="contained"
          color="error"
          sx={{
            bgcolor: '#ef4444',
            '&:hover': {
              bgcolor: '#dc2626',
            },
          }}
        >
          Delete Selected
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default RemoveEventsDialog; 