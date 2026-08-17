import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle2, XCircle, FileText, Download, User, Edit, Save, AlertCircle, HeartPulse, RefreshCw } from 'lucide-react';

export default function DoctorDashboard({ userdata }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Doctor profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fees: 150,
    specialization: '',
    experience: '',
    phone: '',
    address: '',
    timings: { start: '09:00', end: '17:00' }
  });

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/doctor/getdoctorappointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAppointments(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctor appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    setSuccessMsg('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/doctor/handlestatus', {
        appointmentId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSuccessMsg(`Appointment status changed to ${newStatus}`);
        fetchDoctorAppointments();
      } else {
        setError(res.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      setError('Server error updating appointment status');
    }
  };

  const handleDownloadDocument = (appointmentId, originalName) => {
    const token = localStorage.getItem('token');
    window.open(`/api/doctor/getdocumentdownload?appointId=${appointmentId}&token=${token}`, '_blank');
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeartPulse size={24} color="#34d399" />
            <h2 style={{ fontSize: '1.6rem' }}>Doctor Consultation Portal</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your patient appointments, consultation statuses, and medical attachments
          </p>
        </div>

        <button className="btn-secondary" onClick={fetchDoctorAppointments} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> Refresh Requests
        </button>
      </div>

      {successMsg && (
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
          marginBottom: '20px'
        }}>
          <CheckCircle2 size={18} /> {successMsg}
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
          marginBottom: '20px'
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Appointment Requests Table */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Patient Appointments List</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Loading patient appointments...</div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Calendar size={40} color="#475569" style={{ marginBottom: '10px' }} />
            <p>No patient appointment requests assigned to you yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <th style={{ padding: '12px' }}>Patient Name</th>
                  <th style={{ padding: '12px' }}>Scheduled Date/Time</th>
                  <th style={{ padding: '12px' }}>Contact Phone</th>
                  <th style={{ padding: '12px' }}>Attachment</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>
                      {app.userInfo?.name || 'Patient'}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#38bdf8' }}>
                      {app.date}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#94a3b8' }}>
                      {app.userInfo?.phone || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {app.document ? (
                        <button
                          className="btn-secondary"
                          onClick={() => handleDownloadDocument(app._id, app.document?.originalname)}
                          style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                        >
                          <Download size={14} color="#06b6d4" /> File
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge badge-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {app.status === 'pending' && (
                          <button
                            className="btn-success"
                            onClick={() => handleStatusChange(app._id, 'scheduled')}
                          >
                            Accept
                          </button>
                        )}
                        {app.status === 'scheduled' && (
                          <button
                            className="btn-primary"
                            onClick={() => handleStatusChange(app._id, 'completed')}
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          >
                            Mark Completed
                          </button>
                        )}
                        {app.status !== 'rejected' && app.status !== 'completed' && (
                          <button
                            className="btn-danger"
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
