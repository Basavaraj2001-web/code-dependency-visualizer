import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data.data;
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const uploadProject = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/projects/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data;
};

export const getProjectStats = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/stats`);
  return response.data.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data.data;
};

export const getDependencies = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/dependencies`);
  return response.data.data;
};

export const getGraph = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/graph`);
  return response.data.data;
};

export const getCycles = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/cycles`);
  return response.data.data;
};

export default api;
