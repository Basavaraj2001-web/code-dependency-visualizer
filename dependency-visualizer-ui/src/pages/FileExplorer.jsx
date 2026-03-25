import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGraph } from '../services/api';
import { ArrowLeft, Search, ArrowUpRight, ArrowDownLeft, FileCode2 } from 'lucide-react';

const FileExplorer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getGraph(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const fileMappings = data.nodes.map((node) => ({
    name: node,
    shortName: node.split(/[./]/).pop(),
    outgoing: data.edges.filter((e) => e.source === node).map((e) => e.target),
    incoming: data.edges.filter((e) => e.target === node).map((e) => e.source),
  }));

  const filtered = fileMappings.filter((f) =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Loading files…</span></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Back */}
      <div className="back-row">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/project/${id}`)}>
          <ArrowLeft size={16} />
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Project / <strong style={{ color: 'var(--text-primary)' }}>File Explorer</strong>
        </span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">File Explorer</h1>
          <p className="page-subtitle">
            {fileMappings.length} source file{fileMappings.length !== 1 ? 's' : ''} — showing all imports and dependents
          </p>
        </div>
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input
            className="input-field search-input"
            placeholder="Filter files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="file-search"
          />
        </div>
      </div>

      {/* File rows */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><FileCode2 size={24} /></div>
            <div className="empty-state-title">No files found</div>
            <p className="empty-state-text">{search ? 'Try a different search term.' : 'No source files detected in this project.'}</p>
          </div>
        </div>
      ) : (
        filtered.map((file, idx) => (
          <motion.div
            key={file.name}
            className="file-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            id={`file-row-${idx}`}
          >
            <div className="file-row-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileCode2 size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span className="file-row-name">{file.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="badge badge-blue" style={{ fontSize: 10 }}>
                  <ArrowUpRight size={10} /> {file.outgoing.length}
                </span>
                <span className="badge badge-yellow" style={{ fontSize: 10 }}>
                  <ArrowDownLeft size={10} /> {file.incoming.length}
                </span>
              </div>
            </div>

            <div className="file-row-body">
              {/* Outgoing */}
              <div className="dep-list">
                <div className="dep-list-title">
                  <div className="dep-list-title-dot" style={{ background: 'var(--accent)' }} />
                  Imports ({file.outgoing.length})
                </div>
                {file.outgoing.length > 0 ? (
                  file.outgoing.map((dep, i) => (
                    <div key={i} className="dep-item">
                      <ArrowUpRight size={11} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span>{dep.split(/[./]/).pop()}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                        {dep}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No imports</p>
                )}
              </div>

              {/* Incoming */}
              <div className="dep-list">
                <div className="dep-list-title">
                  <div className="dep-list-title-dot" style={{ background: 'var(--warning)' }} />
                  Depended on by ({file.incoming.length})
                </div>
                {file.incoming.length > 0 ? (
                  file.incoming.map((dep, i) => (
                    <div key={i} className="dep-item">
                      <ArrowDownLeft size={11} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                      <span>{dep.split(/[./]/).pop()}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                        {dep}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No dependents</p>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default FileExplorer;
