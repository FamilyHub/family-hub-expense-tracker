import React from 'react';
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
  styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CalendarEvent } from '../../services/eventService';
import { useEventStatus } from '../../hooks/useEventStatus';
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

const StatusButton = styled(Button)(({ completed }: { completed: boolean }) => ({
  minWidth: '160px',
  backgroundColor: completed ? '#4ade80' : '#ef4444',
  color: 'white',
  '&:hover': {
    backgroundColor: completed ? '#22c55e' : '#dc2626',
  },
  '&.Mui-disabled': {
    backgroundColor: completed ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    color: 'rgba(255, 255, 255, 0.7)'
  }
}));

const EventListDialog: React.FC<EventListDialogProps> = ({
  open,
  onClose,
  events,
  selectedDate,
  onEditEvent,
  onMarkCompleted
}) => {
  const { updateStatus, isLoading } = useEventStatus();

  const handleEditClick = (event: CalendarEvent) => {
    onEditEvent(event);
  };

  const handleStatusClick = async (event: CalendarEvent) => {
    if (isLoading) return;

    // If event is not completed, we want to mark it as completed (true)
    // If event is completed, we want to mark it as not completed (false)
    const targetStatus = !event.eventCompleted;
    const success = await updateStatus(event, targetStatus);
    
    if (success) {
      onMarkCompleted({
        ...event,
        eventCompleted: targetStatus
      });
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
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {dayjs(event.eventDate).format('h:mm A')}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <StatusButton
                    completed={event.eventCompleted}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick(event);
                    }}
                    disabled={isLoading}
                    size="small"
                  >
                    {event.eventCompleted ? 'Mark as not completed' : 'Mark as completed'}
                  </StatusButton>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(event);
                    }}
                    sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <EditIcon />
                  </IconButton>
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