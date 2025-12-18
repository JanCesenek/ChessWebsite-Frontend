import axios from "axios";
import { jwtDecode } from "jwt-decode";

const url = import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: url,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to check if the token has expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime; // Token is expired if `exp` is less than the current time
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat invalid tokens as expired
  }
};

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if the token is expired
      if (isTokenExpired(token)) {
        // Clear the token and log the user out
        localStorage.clear(); // Redirect to login page
        alert("Vaše relace vypršela. Přihlašte se znovu.");
        return Promise.reject("Token expired");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
