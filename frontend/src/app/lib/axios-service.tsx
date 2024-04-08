import axios from "axios";

// Create an axios instance with a custom config
const client = axios.create({
  baseURL: "https://116a-137-195-249-13.ngrok-free.app",
  headers: { "Content-Type": "application/json" },
});

export default client;
