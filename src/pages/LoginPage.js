// Login Page
import React, { useState } from 'react';
import { login, signInWithGoogle } from '../services/authService';
import './AuthPages.css';

function LoginPage({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      await login(email, password);
      // Auth context will handle redirect
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      // Auth context will handle redirect
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1>Fitness Tracker</h1>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to your account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="divider">
            <span>Or</span>
          </div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            🔍 Sign in with Google
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button className="link-btn" onClick={onSwitchToSignup}>
                Sign up
              </button>
            </p>
          </div>

          <div className="test-credentials">
            <p>🧪 Test Account:</p>
            <code>test@example.com / test123456</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
