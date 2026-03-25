import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadProject } from '../services/api';
import { UploadCloud, CheckCircle2, AlertCircle, FileArchive, X } from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  /* ── File helpers ── */
  const acceptFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith('.zip')) {
      setError('Only .zip files are supported.');
      return;
    }
    setFile(f);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => acceptFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  /* ── Upload ── */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a ZIP file first.'); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate progress animation while real request runs
    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + Math.random() * 12 : p));
    }, 300);

    try {
      const data = await uploadProject(file);
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(`"${data.projectName}" analyzed successfully!`);
      setTimeout(() => navigate(`/project/${data.projectId}`), 1400);
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 640, margin: '0 auto', paddingTop: 12 }}
    >
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Upload Repository</h1>
          <p className="page-subtitle">Zip your project and upload it to analyze its dependency graph.</p>
        </div>
      </div>

      {/* Info card */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span className="badge badge-blue" style={{ marginTop: 2, flexShrink: 0 }}>Supports</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Java (<code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>.java</code>),
            JavaScript (<code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>.js/.jsx</code>),
            TypeScript (<code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>.ts/.tsx</code>)
            — archives up to <strong style={{ color: 'var(--text-primary)' }}>50 MB</strong>
          </span>
        </div>
      </div>

      <form onSubmit={handleUpload}>
        {/* Drop zone */}
        <div
          className={`upload-zone${dragging ? ' upload-zone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          id="upload-drop-zone"
        >
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            id="file-input"
            disabled={loading}
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
              >
                <div style={{
                  width: 56, height: 56,
                  background: 'rgba(63,185,80,0.1)',
                  border: '1px solid rgba(63,185,80,0.3)',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--success)'
                }}>
                  <FileArchive size={26} />
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt(file.size)}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setProgress(0); }}
                  className="btn btn-ghost"
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  <X size={13} /> Remove
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="upload-icon">
                  <UploadCloud size={28} />
                </div>
                <p className="upload-title">Drop your ZIP here</p>
                <p className="upload-subtitle">or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>browse file</span> to upload</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>Uploading & analyzing…</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}

        {/* Feedback alerts */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="alert" style={{ marginTop: 14 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="alert alert-success" style={{ marginTop: 14 }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          id="upload-submit-btn"
          disabled={loading || !file}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 18, justifyContent: 'center', padding: '12px 20px', fontSize: 14 }}
        >
          {loading ? (
            <><div className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Analyzing...</>
          ) : (
            <><UploadCloud size={16} /> Start Analysis</>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UploadPage;
