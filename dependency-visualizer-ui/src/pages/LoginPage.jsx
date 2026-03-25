import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Network, Lock, User } from 'lucide-react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(form.username, form.password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel – Branding */}
      <motion.div
        className="auth-brand"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <Network size={36} />
          </div>
          <h1 className="auth-brand-title">Dependency Visualizer</h1>
          <p className="auth-brand-sub">
            Analyze, visualize, and eliminate circular dependencies in your Java &amp; JavaScript codebases.
          </p>

          <div className="auth-features">
            {['Interactive dependency graph', 'Circular dependency detection', 'Multi-language support (Java, JS, TS)', 'Project history & statistics'].map((f) => (
              <div key={f} className="auth-feature-item">
                <span className="auth-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel – Form */}
      <motion.div
        className="auth-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-sub">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-username">Username</label>
              <div className="auth-input-wrap">
                <User size={18} className="auth-input-icon" />
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input auth-input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="auth-eye-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button id="login-submit-btn" type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? <><Loader2 size={20} className="auth-spinner" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-switch-link">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
