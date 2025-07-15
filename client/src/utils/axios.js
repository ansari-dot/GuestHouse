import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Add a response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 429) {
      alert("You are making requests too quickly. Please wait a moment and try again.");
    }
    return Promise.reject(error);
  }
);

export default instance; 