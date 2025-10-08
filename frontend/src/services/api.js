import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://elective-registration-system-tdeq.onrender.com/api"  // Production
        : "http://localhost:5000/api", // Development
});

// attach token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
