import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, User, Mail, Lock, Phone, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    type: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/user/register', user);
      if (res.data.success) {
        alert('Registered Successfully! Please log in.');
        navigate('/login');
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '36px',
        borderRadius: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Stethoscope size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Create an Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Join MediCareBook to book doctor appointments or manage healthcare services
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                className="form-input"
                placeholder="John Doe"
                value={user.fullName}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="email"
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="name@domain.com"
                value={user.email}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="phone"
                type="text"
                name="phone"
                required
                className="form-input"
                placeholder="555-0199"
                value={user.phone}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="password"
                type="password"
                name="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={user.password}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: user.type === 'user' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                background: user.type === 'user' ? 'rgba(6,182,212,0.1)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <input
                  type="radio"
                  name="type"
                  value="user"
                  checked={user.type === 'user'}
                  onChange={handleChange}
                  style={{ accentColor: '#06b6d4' }}
                />
                Patient / User
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: user.type === 'admin' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
                background: user.type === 'admin' ? 'rgba(139,92,246,0.1)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                <input
                  type="radio"
                  name="type"
                  value="admin"
                  checked={user.type === 'admin'}
                  onChange={handleChange}
                  style={{ accentColor: '#8b5cf6' }}
                />
                Platform Admin
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {loading ? 'Creating Account...' : 'Register Now'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '24px' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
