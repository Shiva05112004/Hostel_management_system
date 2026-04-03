

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Adjust if your backend is on a different port
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
