import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Typography,
  Tooltip,
  styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CalendarEvent } from '../../services/eventService';
import dayjs from 'dayjs';

interface EventListDialogProps {
  open: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  selectedDate: Date;
  onEditEvent: (event: CalendarEvent) => void;
  onMarkCompleted: (event: CalendarEvent) => void;
}

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
`;

const EventListItem = styled(ListItem)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventListDialog: React.FC<EventListDialogProps> = ({
  open,
  onClose,
  events,
  selectedDate,
  onEditEvent,
  onMarkCompleted
}) => {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleEditClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    onEditEvent(event);
  };

  const handleMarkCompleted = (event: CalendarEvent) => {
    onMarkCompleted(event);
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Events for {dayjs(selectedDate).format('MMMM D, YYYY')}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {events.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No events for this date</Typography>
          </Box>
        ) : (
          <List>
            {events.map((event, index) => (
              <EventListItem key={index}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>
                        {event.eventName}
                      </Typography>
                      {event.eventCompleted && (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {dayjs(event.eventDate).format('h:mm A')}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Mark as Completed">
                    <IconButton
                      edge="end"
                      onClick={() => handleMarkCompleted(event)}
                      sx={{ mr: 1, color: event.eventCompleted ? 'success.main' : 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Event">
                    <IconButton
                      edge="end"
                      onClick={() => handleEditClick(event)}
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </EventListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EventListDialog; 