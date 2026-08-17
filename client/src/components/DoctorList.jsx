import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Award, Clock, DollarSign, Calendar, Upload, CheckCircle2, AlertCircle, X, Stethoscope, Phone } from 'lucide-react';

export default function DoctorList({ userDoctorId, doctors, userdata, onBookingComplete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking Modal State
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Extract unique specialties
  const specialties = ['All', ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || doc.specialization === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setMessage('');
    setError('');
    setDateTime('');
    setDocumentFile(null);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!dateTime) {
      setError('Please select an appointment date and time.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('doctorId', selectedDoctor._id);
      formData.append('userId', userDoctorId || userdata?._id);
      formData.append('date', dateTime.replace('T', ' '));
      formData.append('userInfo', JSON.stringify({
        name: userdata?.fullName || 'Patient',
        email: userdata?.email || '',
        phone: userdata?.phone || ''
      }));
      formData.append('doctorInfo', JSON.stringify(selectedDoctor));

      if (documentFile) {
        formData.append('image', documentFile);
      }

      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/getappointment', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage('Appointment booked successfully! Pending doctor review.');
        setTimeout(() => {
          handleCloseModal();
          if (onBookingComplete) onBookingComplete();
        }, 1800);
      } else {
        setError(res.data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error while booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Search & Filter Header */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', borderRadius: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search doctors by name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '42px', width: '100%' }}
            />
          </div>

          <select
            className="form-select"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec} Specialty</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <Stethoscope size={48} color="#64748b" style={{ marginBottom: '12px' }} />
          <h3>No Available Doctors Found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Try adjusting your search query or specialty filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredDoctors.map((doc) => (
            <div key={doc._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    color: '#fff'
                  }}>
                    {doc.fullName?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{doc.fullName}</h3>
                    <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>
                      {doc.specialization}
                    </div>
                  </div>
                </div>
                <span className="badge badge-approved">Verified</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} color="#06b6d4" /> Experience: <strong style={{ color: '#f8fafc' }}>{doc.experience}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#3b82f6" /> {doc.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#8b5cf6" /> {doc.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#34d399" /> Hours: {doc.timings ? `${doc.timings.start || '09:00'} - ${doc.timings.end || '17:00'}` : '09:00 - 17:00'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginTop: '4px' }}>
                  <DollarSign size={18} color="#f59e0b" /> Fee: <strong style={{ color: '#38bdf8' }}>₹{doc.fees}</strong>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => handleOpenModal(doc)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>Book Appointment</h3>
                <p style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>
                  {selectedDoctor.fullName} ({selectedDoctor.specialization})
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {message && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={18} /> {message}
              </div>
            )}

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
                marginBottom: '16px'
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label className="form-label" htmlFor="appointmentDate">Select Preferred Date & Time</label>
                <input
                  id="appointmentDate"
                  type="datetime-local"
                  required
                  className="form-input"
                  min={new Date().toISOString().slice(0, 16)}
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="medicalDocument">
                  Upload Medical Record / Document (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="medicalDocument"
                    type="file"
                    className="form-input"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setDocumentFile(e.target.files[0])}
                    style={{ width: '100%' }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Supported formats: PDF, Images, Word Documents.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '24px',
                fontSize: '0.85rem',
                color: '#94a3b8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Consultation Fee:</span>
                  <span style={{ color: '#f8fafc', fontWeight: '700' }}>₹{selectedDoctor.fees}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Location:</span>
                  <span style={{ color: '#f8fafc' }}>{selectedDoctor.address}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting Request...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
