import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, ArrowRight, Plus, FolderOpen, TrendingUp } from 'lucide-react';
import { getAllProjects } from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading projects...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

      {/* ── Stats strip ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--blue">
            <FolderOpen size={20} />
          </div>
          <div>
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{projects.length > 0 ? 'Active' : '–'}</div>
            <div className="stat-label">Workspace Status</div>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Select a project to explore its dependency graph.</p>
        </div>
        <button id="new-analysis-btn" className="btn btn-primary" onClick={() => navigate('/upload')}>
          <Plus size={15} />
          New Analysis
        </button>
      </div>

      {/* ── Project Grid ── */}
      {projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Folder size={28} />
            </div>
            <div className="empty-state-title">No projects yet</div>
            <p className="empty-state-text" style={{ marginBottom: '20px' }}>
              Upload a zipped repository to start visualizing dependencies.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/upload')}>
              <Plus size={14} />
              Upload your first project
            </button>
          </div>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="project-card"
              onClick={() => navigate(`/project/${project.id}`)}
              id={`project-card-${project.id}`}
            >
              <div className="project-card-top">
                <div className="project-card-icon">
                  <Folder size={20} />
                </div>
                <span className="badge badge-blue">#{project.id}</span>
              </div>
              <div>
                <div className="project-card-name">{project.name}</div>
                <div className="project-card-date">
                  Uploaded {new Date(project.uploadDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
              </div>
              <div className="project-card-footer">
                <span>Open project</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
