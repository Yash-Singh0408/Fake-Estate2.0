import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://fakeestate2-0-backend.onrender.com/api"
  : "http://localhost:8000/api";

const apiRequest = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiRequest;
