import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://elective-backend.onrender.com/api"  // Update this with your actual backend URL
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

// API endpoints
export const authAPI = {
    login: (credentials) => API.post("/auth/login", credentials)
};

export const electiveAPI = {
    getAll: () => API.get("/electives"),
    getMy: () => API.get("/electives/my"),
    create: (data) => API.post("/electives", data),
    update: (id, data) => API.put(`/electives/${id}`, data),
    delete: (id) => API.delete(`/electives/${id}`)
};

export const registrationAPI = {
    register: (data) => API.post("/registrations", data),
    getMy: () => API.get("/registrations/me"),
    getAll: () => API.get("/registrations")
};

export const adminAPI = {
    testUpload: (formData) => API.post("/admin/test-upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadStudents: (formData) => API.post("/admin/upload-students", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStudents: () => API.get("/admin/students"),
    getSemesters: () => API.get("/admin/semesters"),
    getElectivesBySemester: (semester) => API.get(`/admin/electives/${semester}`),
    getSectionsBySemester: (semester) => API.get(`/admin/sections/${semester}`),
    getFilteredRegistrations: (params) => API.get("/admin/filtered-registrations", { params })
};

export default API;
