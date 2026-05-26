import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleToggleMode = () => {
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
      result = await login(email, password);
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
      {/* Background glowing decorations */}
      <div className="login-glow-1"></div>
      <div className="login-glow-2"></div>

      <div className="login-card">
        
        {/* App Title */}
        <div className="login-header">
          <div className="login-icon-box">
            <Wallet size={32} />
          </div>
          <h2 className="login-title">FinTrack</h2>
          <p className="login-subtitle">
            {isRegister ? 'Start tracking your expenses beautifully today' : 'Welcome back! Log in to manage your finances'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={20} className="login-error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="login-field">
              <label className="login-label">Full Name</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" size={18} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" size={18} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="login-btn-submit"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="login-footer">
          <span>{isRegister ? 'Already have an account? ' : "Don't have an account? "}</span>
          <button
            onClick={handleToggleMode}
            className="login-footer-link"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
}
