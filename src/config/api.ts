export const API_BASE_URL = 'http://localhost:8081/api/v1';

export const API_ENDPOINTS = {
  events: {
    base: `${API_BASE_URL}/events`,
    update: (id: string) => `${API_BASE_URL}/events/${id}`,
    status: (id: string) => `${API_BASE_URL}/events/${id}/status`,
  }
}; 