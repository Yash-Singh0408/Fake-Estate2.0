import axios from "axios";

const apiRequest = axios.create({
    baseURL: "http://localhost:8000/api" || "https://fakeestate2-0-backend.onrender.com/api",
   withCredentials: true
});

export default apiRequest;