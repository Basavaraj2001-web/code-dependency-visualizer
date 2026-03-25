import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProjects, deleteProject } from '../services/api';
import { Folder, Trash2, ExternalLink, Search, Database } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project from the database?')) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Loading projects…</span></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Projects</h1>
          <p className="page-subtitle">Manage all analyzed repositories stored in the database.</p>
        </div>
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input
            className="input-field search-input"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="projects-search"
          />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>Project Name</th>
                <th>Upload Date</th>
                <th style={{ textAlign: 'right', width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <div className="empty-state" style={{ padding: 0 }}>
                      <div className="empty-state-icon" style={{ margin: '0 auto 16px' }}>
                        <Database size={24} />
                      </div>
                      <div className="empty-state-title">
                        {search ? 'No matching projects' : 'No projects in database'}
                      </div>
                      <p className="empty-state-text">
                        {search ? 'Try a different search term.' : 'Upload a ZIP archive to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((project, idx) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => navigate(`/project/${project.id}`)}
                    id={`project-row-${project.id}`}
                  >
                    <td>
                      <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)' }}>
                        #{project.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Folder size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(project.uploadDate).toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        <button
                          className="btn btn-ghost btn-icon"
                          title="Open project"
                          onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}`); }}
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          title="Delete project"
                          disabled={deletingId === project.id}
                          onClick={(e) => handleDelete(e, project.id)}
                        >
                          {deletingId === project.id
                            ? <div className="spinner spinner-sm" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectsPage;
