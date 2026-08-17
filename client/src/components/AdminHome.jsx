import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, UserCheck, Calendar, CheckCircle2, XCircle, AlertCircle, RefreshCw, Award, Stethoscope } from 'lucide-react';

export default function AdminHome({ userdata, onLogout }) {
  const [activeTab, setActiveTab] = useState('doctors');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [usersRes, docsRes, appRes] = await Promise.all([
        axios.get('/api/admin/getallusers', { headers }),
        axios.get('/api/admin/getalldoctors', { headers }),
        axios.get('/api/admin/getallAppointmentsAdmin', { headers })
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.data || []);
      if (docsRes.data.success) setDoctors(docsRes.data.data || []);
      if (appRes.data.success) setAppointments(appRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveDoctor = async (doctorId, userid) => {
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/getapprove', {
        doctorId,
        status: 'approved',
        userid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage('Doctor application approved successfully! User is now a verified doctor.');
        fetchAdminData();
      } else {
        setError(res.data.message || 'Failed to approve doctor');
      }
    } catch (err) {
      console.error(err);
      setError('Error processing approval');
    }
  };

  const handleRejectDoctor = async (doctorId, userid) => {
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/getreject', {
        doctorId,
        status: 'rejected',
        userid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage('Doctor application rejected.');
        fetchAdminData();
      } else {
        setError(res.data.message || 'Failed to reject doctor');
      }
    } catch (err) {
      console.error(err);
      setError('Error processing rejection');
    }
  };

  const pendingDoctorsCount = doctors.filter(d => d.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Navbar */}
      <nav style={{
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(11, 15, 25, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        sticky: 'top'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            MediCare<span style={{ color: '#8b5cf6' }}>Admin</span> Console
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Admin: <strong style={{ color: '#f8fafc' }}>{userdata?.fullName || 'Administrator'}</strong>
          </span>
          <button className="btn-secondary" onClick={onLogout} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>
        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>TOTAL USERS</span>
              <Users size={20} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px' }}>{users.length}</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #34d399' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>TOTAL DOCTORS</span>
              <UserCheck size={20} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px' }}>{doctors.length}</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>PENDING VERIFICATIONS</span>
              <Award size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px', color: '#f59e0b' }}>
              {pendingDoctorsCount}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>APPOINTMENTS</span>
              <Calendar size={20} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '8px' }}>{appointments.length}</div>
          </div>
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
            marginBottom: '20px'
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
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: activeTab === 'doctors' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
              background: activeTab === 'doctors' ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: activeTab === 'doctors' ? '#c084fc' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Doctors Governance ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: activeTab === 'users' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
              background: activeTab === 'users' ? 'rgba(56,189,248,0.15)' : 'transparent',
              color: activeTab === 'users' ? '#38bdf8' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: activeTab === 'appointments' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
              background: activeTab === 'appointments' ? 'rgba(52,211,153,0.15)' : 'transparent',
              color: activeTab === 'appointments' ? '#34d399' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            All System Appointments ({appointments.length})
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading administration data...
          </div>
        ) : activeTab === 'doctors' ? (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Doctor Verification & Application Approval</h3>
              <button className="btn-secondary" onClick={fetchAdminData} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {doctors.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No doctor applications submitted yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                      <th style={{ padding: '12px' }}>Doctor Name</th>
                      <th style={{ padding: '12px' }}>Specialization</th>
                      <th style={{ padding: '12px' }}>Experience</th>
                      <th style={{ padding: '12px' }}>Fee (₹)</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doc => (
                      <tr key={doc._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{doc.fullName}</td>
                        <td style={{ padding: '12px', color: '#38bdf8' }}>{doc.specialization}</td>
                        <td style={{ padding: '12px' }}>{doc.experience}</td>
                        <td style={{ padding: '12px' }}>₹{doc.fees}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge badge-${doc.status?.toLowerCase()}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {doc.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-success"
                                onClick={() => handleApproveDoctor(doc._id, doc.userId)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleRejectDoctor(doc._id, doc.userId)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'users' ? (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Registered User Accounts</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Phone</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Is Doctor?</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{u.fullName}</td>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>{u.email}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{u.phone || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${u.type === 'admin' ? 'badge-rejected' : 'badge-scheduled'}`}>
                          {u.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {u.isdoctor ? <span className="badge badge-approved">Yes</span> : <span style={{ color: '#64748b' }}>No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>All Platform Appointments</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>Appointment ID</th>
                    <th style={{ padding: '12px' }}>Patient Name</th>
                    <th style={{ padding: '12px' }}>Doctor Name</th>
                    <th style={{ padding: '12px' }}>Scheduled Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontFamily: 'monospace', color: '#64748b' }}>
                        {app._id.substring(0, 10)}...
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        {app.userInfo?.name || 'Patient'}
                      </td>
                      <td style={{ padding: '12px', color: '#38bdf8' }}>
                        {app.doctorInfo?.fullName || app.docName || 'Doctor'}
                      </td>
                      <td style={{ padding: '12px' }}>{app.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge badge-${app.status?.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
