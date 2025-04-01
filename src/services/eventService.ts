import { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import { API_ENDPOINTS } from '../config/api';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set timezone to India
dayjs.tz.setDefault("Asia/Kolkata");

interface CustomField {
  fieldKey: string;
  fieldValue: string;
  fieldValueType: string;
}

interface AddEventRequest {
  eventName: string;
  eventDate: number;
  customFields: CustomField[];
  isAllowNotification: boolean;
  isAllowToSeeThisEvent: boolean;
  isEventCompleted: boolean;
}

export interface CalendarEvent {
  eventId: string;
  eventName: string;
  eventDate: number;
  customFields: CustomField[];
  userId: string;
  isAllowNotification: boolean;
  isAllowToSeeThisEvent: boolean;
  eventCompleted: boolean;
}

export interface BulkEventResponse {
  successList: CalendarEvent[];
  failureList: ResourceInfo[];
}

export interface ResourceInfo {
  eventId: string;
  eventName: string;
  failureReason: string;
}

export const addEvent = async (eventData: {
  eventName: string;
  eventDate: Dayjs | null;
  eventTime: Dayjs | null;
  isAllowedToSendNotification: boolean;
  isParentAllowedToSeeThis: boolean;
}) => {
  try {
    // Convert date and time to Indian timezone
    const eventDate = eventData.eventDate?.tz("Asia/Kolkata").startOf('day');
    const eventTime = eventData.eventTime?.tz("Asia/Kolkata");

    if (!eventDate || !eventTime) {
      throw new Error('Date and time are required');
    }

    // Combine date and time
    const combinedDateTime = eventDate.hour(eventTime.hour()).minute(eventTime.minute());
    
    const requestData: AddEventRequest = {
      eventName: eventData.eventName,
      eventDate: combinedDateTime.valueOf(),
      customFields: [
        {
          fieldKey: "eventTime",
          fieldValue: combinedDateTime.valueOf().toString(),
          fieldValueType: "STRING"
        }
      ],
      isAllowNotification: eventData.isAllowedToSendNotification,
      isAllowToSeeThisEvent: eventData.isParentAllowedToSeeThis,
      isEventCompleted: false
    };

    const response = await fetch(API_ENDPOINTS.events.base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userId': 'user123'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Failed to add event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const fetchMonthEvents = async (startDate: number, endDate: number): Promise<CalendarEvent[]> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.events.base}?startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'userId': 'user123'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    console.log('Fetched events:', data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const updateEvent = async (eventId: string, eventData: {
  eventName: string;
  eventDate: number;
  eventTime: string;
}) => {
  try {
    const requestData = {
      eventId: eventId,
      eventName: eventData.eventName,
      eventDate: eventData.eventDate,
      customFields: [
        {
          fieldKey: "eventTime",
          fieldValue: eventData.eventTime,
          fieldValueType: "STRING"
        }
      ],
      userId: "user123",
      allowNotification: false,
      allowToSeeThisEvent: false,
      eventCompleted: false
    };

    const response = await fetch(`${API_ENDPOINTS.events.base}/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'userId': 'user123'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Failed to update event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const updateEventStatus = async (eventId: string, status: boolean): Promise<any> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.events.base}/${eventId}/status?status=${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'userId': 'user123'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to update event status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

export const getEventsByDateRange = async (startDate: number, endDate: number): Promise<CalendarEvent[]> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.events.base}/events-date-wise?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events by date range');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};

export const bulkDeleteEvents = async (eventIds: string[]): Promise<BulkEventResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.events.base}/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventIds),
    });

    if (!response.ok) {
      throw new Error('Failed to delete events');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting events:', error);
    throw error;
  }
}; 