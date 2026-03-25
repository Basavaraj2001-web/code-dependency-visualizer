import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCycles } from '../services/api';
import { ArrowLeft, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

const CyclesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getCycles(id)
      .then((data) => setCycles(data?.cycles || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (idx) => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Detecting cycles…</span></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Back */}
      <div className="back-row">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/project/${id}`)}>
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Project / <strong style={{ color: 'var(--text-primary)' }}>Circular Dependencies</strong>
        </span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Circular Dependencies</h1>
          <p className="page-subtitle">Detected using depth-first search (DFS) cycle detection algorithm.</p>
        </div>
        {cycles.length > 0 && (
          <span className="badge badge-red" style={{ fontSize: 13, padding: '6px 14px' }}>
            <AlertTriangle size={13} /> {cycles.length} cycle{cycles.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Clean or Cycles */}
      {cycles.length === 0 ? (
        <div className="clean-banner">
          <div className="clean-banner-icon">
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)', marginBottom: 10 }}>
            Clean Architecture!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto' }}>
            No circular dependency loops detected in this repository. Great work keeping your codebase modular.
          </p>
        </div>
      ) : (
        <div>
          {/* Warning banner */}
          <div style={{
            background: 'rgba(248,81,73,0.06)',
            border: '1px solid rgba(248,81,73,0.2)',
            borderRadius: 'var(--r-lg)',
            padding: '14px 18px',
            marginBottom: 18,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#ffa198', marginBottom: 3 }}>Action Required</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Found <strong style={{ color: '#ffa198' }}>{cycles.length}</strong> circular dependency cycle{cycles.length !== 1 ? 's' : ''}.
                Circular dependencies create tight coupling and reduce maintainability. Consider refactoring using dependency inversion or intermediate abstractions.
              </div>
            </div>
          </div>

          {/* Cycle cards */}
          {cycles.map((cycle, idx) => {
            const isOpen = expanded[idx] !== false; // open by default

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="cycle-card"
                id={`cycle-${idx}`}
              >
                {/* Header - clickable to collapse */}
                <div
                  className="cycle-card-header"
                  onClick={() => toggle(idx)}
                  style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
                    <span style={{ fontWeight: 700, color: '#ffa198', fontSize: 13 }}>
                      Cycle #{idx + 1}
                    </span>
                    <span className="badge badge-red" style={{ fontSize: 10 }}>
                      {cycle.length} nodes
                    </span>
                  </div>
                  {isOpen ? <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} /> :
                             <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {/* Node chain */}
                {isOpen && (
                  <div className="cycle-nodes">
                    {cycle.map((node, i) => (
                      <React.Fragment key={i}>
                        <span className={`cycle-node${(i === 0 || i === cycle.length - 1) ? ' cycle-node--start' : ''}`}>
                          {/* Short label */}
                          {node.split(/[./]/).pop()}
                        </span>
                        {i < cycle.length - 1 && (
                          <span className="cycle-arrow">→</span>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Full path expansion */}
                    <div style={{ width: '100%', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Full qualified path
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: '1.8', wordBreak: 'break-all' }}>
                        {cycle.join(' → ')}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default CyclesPage;
