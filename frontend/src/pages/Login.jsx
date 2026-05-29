import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleToggleMode = (e) => {
    e.preventDefault();
    setIsRegister(!isRegister);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    let result;
    if (isRegister) {
      result = await register(name, email, password);
    } else {
      result = await login(email, password, rememberMe);
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Left Side: Visual Anchor */}
      <div className="login-left-section">
        <div className="login-bg-image-wrapper">
          <img
            alt="Security and growth"
            className="login-bg-image"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmv5o0xgasPIP0hoR1IKjjwThyGT1YqkpVqvIprdz47LELbBIp0f0IRPEGmTMIuxpJ4WLns4Y6W-P-9sFPEdoZT3RDxdg7HctlogPfG6JmLKqy-Gxk2JJQKWCf-T05y1Ayka3PjIptle2ic_I6Wro_pzNNY9eh9Yo9OxeeQ02ecwSMdsyuZc7N0BDfbJHZmNOg8rZtYuEMRSPBlUkdAkYsF1fm8arjM10XLFArx59s8I2JQX25S-telXtWXLIbIqxbdMIOsbB5tJE"
          />
        </div>
        <div className="login-left-content">
          <h1 className="login-left-title">Secure. Precise. Intelligent.</h1>
          <p className="login-left-desc">
            FinTrack Pro provides the institutional-grade tools you need to master your financial destiny with absolute clarity.
          </p>
        </div>
        {/* Decorative accent */}
        <div className="login-left-accent"></div>
      </div>

      {/* Right Side: Login Form */}
      <main className="login-right-section">
        <div className="login-form-wrapper">
          {/* Logo / Brand Header */}
          <div className="login-brand-header">
            <div className="login-brand-logo">
              <span className="material-symbols-outlined login-brand-logo-icon">
                account_balance_wallet
              </span>
              <span className="login-brand-title">FinTrack Pro</span>
            </div>
            <h2 className="login-brand-subtitle">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="login-brand-desc">
              {isRegister
                ? 'Please fill in your details to create an account.'
                : 'Please enter your credentials to continue.'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-error-alert">
              <AlertCircle size={20} className="login-error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Full Name Field (Register only) */}
            {isRegister && (
              <div className="floating-label-group">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="transition-all-custom" htmlFor="name">
                  Full Name
                </label>
              </div>
            )}

            {/* Email Field */}
            <div className="floating-label-group">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="transition-all-custom" htmlFor="email">
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="floating-label-group">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="transition-all-custom" htmlFor="password">
                Password
              </label>
            </div>

            {/* Remember & Forgot */}
            <div className="login-actions-container">
              <label className="login-remember-label group">
                <input
                  className="login-remember-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="login-remember-text">
                  Keep me logged in
                </span>
              </label>
              <a className="login-forgot-link" href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            {/* Action Button */}
            <button
              className="login-btn-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Verifying...'}
                </span>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Social Login / Alternative */}
          <div className="login-spacer-container">
            <div className="login-spacer-line-wrapper">
              <div className="login-spacer-line"></div>
            </div>
            <div className="login-spacer-text-wrapper">
              <span className="login-spacer-text">Secure Identity</span>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="login-footer-text">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <a
                className="login-footer-link"
                href="#"
                onClick={handleToggleMode}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </a>
            </p>
          </div>
        </div>

        {/* Sticky Bottom Footer (Privacy/Terms) */}
        <footer className="login-sticky-footer">
          <a className="login-sticky-link" href="#" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          <a className="login-sticky-link" href="#" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>
          <a className="login-sticky-link" href="#" onClick={(e) => e.preventDefault()}>
            Security
          </a>
        </footer>
      </main>
    </div>
  );
}
