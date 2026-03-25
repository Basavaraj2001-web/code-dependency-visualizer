import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectStats } from '../services/api';
import { Network, FileSearch, RefreshCcw, ArrowLeft, Files, GitMerge, Calendar, Hash } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectStats(id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Loading project...</span></div>;
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Project not found</div>
        <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    );
  }

  const tools = [
    {
      id: 'graph-tool',
      title: 'Dependency Graph',
      desc: 'Interactive D3 force-directed node map of all parsed code relationships.',
      icon: <Network size={22} />,
      path: `/project/${id}/graph`,
      color: '--accent',
      bgClass: 'stat-icon--blue',
    },
    {
      id: 'files-tool',
      title: 'File Explorer',
      desc: 'Browse every source file, its outgoing imports and incoming dependents.',
      icon: <FileSearch size={22} />,
      path: `/project/${id}/files`,
      color: '--success',
      bgClass: 'stat-icon--green',
    },
    {
      id: 'cycles-tool',
      title: 'Circular Dependencies',
      desc: 'DFS cycle detection — pinpoints every architectural loop in the codebase.',
      icon: <RefreshCcw size={22} />,
      path: `/project/${id}/cycles`,
      color: '--danger',
      bgClass: 'stat-icon--red',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Back */}
      <div className="back-row">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Dashboard / <strong style={{ color: 'var(--text-primary)' }}>{stats.name}</strong>
        </span>
      </div>

      {/* Project info card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="card-title" style={{ fontSize: 16, letterSpacing: -0.3, fontFamily: 'var(--font-sans)', textTransform: 'none', color: 'var(--text-primary)' }}>
              {stats.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={12} />
              Uploaded {new Date(stats.uploadDate).toLocaleString()}
            </div>
          </div>
          <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Hash size={10} />{stats.id}
          </span>
        </div>

        {/* Stats */}
        <div className="card-body">
          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card">
              <div className="stat-icon stat-icon--blue"><Files size={20} /></div>
              <div>
                <div className="stat-value">{stats.totalFiles ?? '—'}</div>
                <div className="stat-label">Source Files</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon--cyan"><GitMerge size={20} /></div>
              <div>
                <div className="stat-value">{stats.totalDependencies ?? '—'}</div>
                <div className="stat-label">Dependencies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exploration tools */}
      <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
        Exploration Tools
      </h2>

      <div className="action-grid">
        {tools.map((tool, idx) => (
          <motion.div
            key={tool.id}
            id={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="action-card"
            onClick={() => navigate(tool.path)}
          >
            <div className={`action-card-icon stat-icon ${tool.bgClass}`}>
              {tool.icon}
            </div>
            <div>
              <div className="action-card-title">{tool.title}</div>
              <div className="action-card-desc">{tool.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
