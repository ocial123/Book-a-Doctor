import React, { useState } from 'react';
import axios from 'axios';
import { User, Phone, Mail, MapPin, Award, DollarSign, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ApplyDoctor({ userId, userdata, onApplicationSubmitted }) {
  const [doctor, setDoctor] = useState({
    fullName: userdata?.fullName || '',
    email: userdata?.email || '',
    phone: userdata?.phone || '',
    address: '',
    specialization: 'Cardiology',
    experience: '5 Years',
    fees: 150,
    timings: {
      start: '09:00',
      end: '17:00'
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleTimingChange = (e) => {
    setDoctor({
      ...doctor,
      timings: {
        ...doctor.timings,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/user/registerdoc',
        { doctor, userId: userId || userdata?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage('Your Doctor registration application has been submitted successfully! Platform admin will review and verify your account.');
        if (onApplicationSubmitted) onApplicationSubmitted();
      } else {
        setError(res.data.message || 'Failed to submit doctor application');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error submitting application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', borderRadius: '20px' }}>
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Apply as Healthcare Provider</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Provide your professional background and medical practice details to register as a verified doctor.
        </p>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '14px 18px',
          borderRadius: '12px',
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <CheckCircle2 size={20} /> {message}
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '14px 18px',
          borderRadius: '12px',
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h4 style={{ fontSize: '1.1rem', color: '#06b6d4', marginBottom: '16px' }}>1. Personal & Contact Information</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="docFullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="docFullName"
                type="text"
                name="fullName"
                required
                className="form-input"
                value={doctor.fullName}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docPhone">Contact Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="docPhone"
                type="text"
                name="phone"
                required
                className="form-input"
                value={doctor.phone}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="docEmail">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="docEmail"
                type="email"
                name="email"
                required
                className="form-input"
                value={doctor.email}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docAddress">Clinic / Practice Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="docAddress"
                type="text"
                name="address"
                required
                className="form-input"
                placeholder="123 Medical Center Way, Suite 10"
                value={doctor.address}
                onChange={handleChange}
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: '1.1rem', color: '#06b6d4', marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          2. Professional Medical Details
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="docSpecialization">Specialization</label>
            <select
              id="docSpecialization"
              name="specialization"
              className="form-select"
              value={doctor.specialization}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Physician">General Physician</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docExperience">Experience</label>
            <input
              id="docExperience"
              type="text"
              name="experience"
              required
              className="form-input"
              placeholder="e.g. 8 Years"
              value={doctor.experience}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="docFees">Consultation Fee (₹)</label>
            <input
              id="docFees"
              type="number"
              name="fees"
              required
              className="form-input"
              placeholder="500"
              value={doctor.fees}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="startTime">Work Shift Start Time</label>
            <input
              id="startTime"
              type="time"
              name="start"
              required
              className="form-input"
              value={doctor.timings.start}
              onChange={handleTimingChange}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="endTime">Work Shift End Time</label>
            <input
              id="endTime"
              type="time"
              name="end"
              required
              className="form-input"
              value={doctor.timings.end}
              onChange={handleTimingChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
        >
          {loading ? 'Submitting Application...' : 'Submit Doctor Application'} <Send size={18} />
        </button>
      </form>
    </div>
  );
}
