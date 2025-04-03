import { useState, useRef } from 'react';
import { CalendarEvent, updateEventStatus } from '../services/eventService';

interface EventStatusState {
  isLoading: boolean;
  error: string | null;
}

export const useEventStatus = () => {
  const [state, setState] = useState<EventStatusState>({
    isLoading: false,
    error: null
  });
  const isUpdatingRef = useRef(false);

  const updateStatus = async (event: CalendarEvent, targetStatus: boolean): Promise<boolean> => {
    // Prevent concurrent updates and duplicate calls
    if (state.isLoading || isUpdatingRef.current) return false;
    
    // If the event is already in the target status, do nothing
    if (event.eventCompleted === targetStatus) return false;

    isUpdatingRef.current = true;
    setState({ isLoading: true, error: null });
    
    try {
      if (!event.eventId) {
        throw new Error('Cannot update event status: No event ID');
      }

      // Make API call with the exact status we want
      const response = await updateEventStatus(event.eventId, targetStatus);
      
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating event status';
      setState({ isLoading: false, error: errorMessage });
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
      isUpdatingRef.current = false;
    }
  };

  return {
    updateStatus,
    isLoading: state.isLoading,
    error: state.error
  };
}; 