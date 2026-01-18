import axios from 'axios';

// get api url and api key from env 
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// intercept response error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;