import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Network, Lock, User, Mail } from 'lucide-react';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return 'Please fill in all fields.';
    }
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      const data = await registerUser(form.username, form.email, form.password);
      setSuccess('Account created! Redirecting...');
      login(data);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][strength];

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
          <h1 className="auth-brand-title">Join the Platform</h1>
          <p className="auth-brand-sub">
            Create a free account and start analyzing your project dependencies in minutes.
          </p>

          <div className="auth-features">
            {['Upload ZIP repositories in seconds', 'Get instant dependency graphs', 'Detect circular dependencies', 'Track multiple projects'].map((f) => (
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
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-sub">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-username">Username</label>
              <div className="auth-input-wrap">
                <User size={18} className="auth-input-icon" />
                <input id="reg-username" name="username" type="text" autoComplete="username"
                  placeholder="Choose a username" value={form.username} onChange={handleChange} className="auth-input" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />
                <input id="reg-email" name="email" type="email" autoComplete="email"
                  placeholder="Enter your email" value={form.email} onChange={handleChange} className="auth-input" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="Create a password (min 6 chars)"
                  value={form.password} onChange={handleChange} className="auth-input auth-input-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="auth-eye-btn">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="password-strength-bar">
                  <div className="strength-track">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="strength-segment"
                        style={{ backgroundColor: i <= strength ? strengthColor : '#e2e8f0' }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input id="reg-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={handleChange} className="auth-input" />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-success">
                <CheckCircle2 size={18} className="flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            <button id="register-submit-btn" type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? <><Loader2 size={20} className="auth-spinner" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
