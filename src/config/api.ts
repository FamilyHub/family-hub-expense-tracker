export const API_BASE_URL = 'http://localhost:8081/api/v1';

export const API_ENDPOINTS = {
  events: {
    base: 'http://localhost:8081/api/v1/events',
    update: (id: string) => `http://localhost:8081/api/v1/events/${id}`,
    status: (id: string) => `http://localhost:8081/api/v1/events/${id}/status`
  },
  transactions: {
    base: 'http://localhost:8081/api/v1/transactions',
    byCategory: (category: string) => `http://localhost:8081/api/v1/transactions/by-category?category=${encodeURIComponent(category)}`
  }
}; 