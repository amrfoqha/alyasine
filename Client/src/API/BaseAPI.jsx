import axios from "axios";

const BaseAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

export default BaseAPI;
