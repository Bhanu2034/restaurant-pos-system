import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import { T, FONT_DISPLAY, FONT_BODY } from '../../constants/theme';
import { DEFAULT_ROUTES } from '../../auth/defaultRoutes';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const response = await login(username, password);

      navigate(
        DEFAULT_ROUTES[response.user.role.toUpperCase()] ?? "/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: T.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_BODY,
        padding: '20px'
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px', padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              color: T.primary,
              margin: '0 0 8px 0',
              fontSize: '32px',
            }}
          >
            Malgudi POS
          </h1>
          <p style={{ margin: 0, color: T.inkSoft, fontSize: '14px' }}>
            Enter your credentials to access the system
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: T.kumkumSoft,
              color: T.kumkum,
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '6px',
                color: T.ink,
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. manager"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                backgroundColor: T.surface,
                color: T.ink,
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '6px',
                color: T.ink,
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                backgroundColor: T.surface,
                color: T.ink,
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              marginTop: '10px',
              padding: '14px',
              backgroundColor: isLoggingIn ? T.primaryLight : T.primary,
              color: T.surface,
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </Card>
    </div>
  );
}
