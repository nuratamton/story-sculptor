import axios from "axios";

// Create an axios instance with a custom config
const client = axios.create({
  baseURL: "https://7ce8-34-124-160-229.ngrok-free.app",
  headers: { "Content-Type": "application/json" },
});

export default client;
