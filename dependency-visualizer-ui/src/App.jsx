import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ProjectDetails from './pages/ProjectDetails';
import GraphPage from './pages/GraphPage';
import FileExplorer from './pages/FileExplorer';
import CyclesPage from './pages/CyclesPage';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes – require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/project/:id/graph" element={<GraphPage />} />
              <Route path="/project/:id/files" element={<FileExplorer />} />
              <Route path="/project/:id/cycles" element={<CyclesPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
