import axios from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://reddybackend.vercel.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const getSports = async () => {
  const response = await api.get('/api/sports');
  return response.data;
};

export const getMatches = async (sportId) => {
  const response = await api.get(`/api/matches/${sportId}`);
  return response.data;
};

export const getMatchDetails = async (eventId) => {
  const response = await api.get(`/api/match/${eventId}`);
  return response.data;
};

export default api; 
