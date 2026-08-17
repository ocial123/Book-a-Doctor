import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, User, Calendar, Bell, LogOut, Award, HeartPulse, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import DoctorList from './DoctorList';
import ApplyDoctor from './ApplyDoctor';
import Notification from './Notification';
import DoctorDashboard from './DoctorDashboard';

export default function UserHome({ userdata: initialUserData, onLogout }) {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(initialUserData || null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [loading, setLoading] = useState(true);

  // Fetch updated user info & doctors
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Get fresh user data
      const userRes = await axios.post('/api/user/getuserdata', {}, { headers });
      if (userRes.data.success && userRes.data.data) {
        setUserdata(userRes.data.data);
        localStorage.setItem('userData', JSON.stringify(userRes.data.data));
      }

      // 2. Get approved doctors
      const docRes = await axios.get('/api/user/getalldoctorsu', { headers });
      if (docRes.data.success) {
        setDoctors(docRes.data.data || []);
      }

      // 3. Get user appointments
      const appRes = await axios.get('/api/user/getuserappointments', { headers });
      if (appRes.data.success) {
        setAppointments(appRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const unreadNotificationsCount = userdata?.notification?.length || 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'rgba(11, 15, 25, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px 24px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            MediCare<span style={{ color: '#06b6d4' }}>Book</span>
          </span>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => setActiveMenuItem('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: activeMenuItem === 'home' ? '1px solid #06b6d4' : '1px solid transparent',
              background: activeMenuItem === 'home' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeMenuItem === 'home' ? '#38bdf8' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textAlign: 'left'
            }}
          >
            <Stethoscope size={18} /> Find Doctors
          </button>

          <button
            onClick={() => setActiveMenuItem('appointments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: activeMenuItem === 'appointments' ? '1px solid #3b82f6' : '1px solid transparent',
              background: activeMenuItem === 'appointments' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeMenuItem === 'appointments' ? '#60a5fa' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textAlign: 'left'
            }}
          >
            <Calendar size={18} /> My Appointments ({appointments.length})
          </button>

          {!userdata?.isdoctor && (
            <button
              onClick={() => setActiveMenuItem('applyDoctor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenuItem === 'applyDoctor' ? '1px solid #8b5cf6' : '1px solid transparent',
                background: activeMenuItem === 'applyDoctor' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: activeMenuItem === 'applyDoctor' ? '#c084fc' : '#94a3b8',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                textAlign: 'left'
              }}
            >
              <Award size={18} /> Apply as Doctor
            </button>
          )}

          {userdata?.isdoctor && (
            <button
              onClick={() => setActiveMenuItem('doctorPortal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenuItem === 'doctorPortal' ? '1px solid #34d399' : '1px solid transparent',
                background: activeMenuItem === 'doctorPortal' ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
                color: activeMenuItem === 'doctorPortal' ? '#34d399' : '#94a3b8',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                textAlign: 'left'
              }}
            >
              <HeartPulse size={18} /> Doctor Dashboard
            </button>
          )}

          <button
            onClick={() => setActiveMenuItem('notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              border: activeMenuItem === 'notifications' ? '1px solid #f59e0b' : '1px solid transparent',
              background: activeMenuItem === 'notifications' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeMenuItem === 'notifications' ? '#fbbf24' : '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} /> Notifications
            </div>
            {unreadNotificationsCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#000',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Footer Profile in Sidebar */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            className="btn-secondary"
            onClick={onLogout}
            style={{ width: '100%', justifyContent: 'center', color: '#f87171' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          padding: '16px 36px',
          background: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          sticky: 'top',
          zIndex: 50
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>
              Hello, {userdata?.isdoctor ? `Dr. ${userdata.fullName}` : userdata?.fullName || 'User'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              {userdata?.isdoctor ? 'Doctor Account' : 'Patient Dashboard'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setActiveMenuItem('notifications')}
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Bell size={18} color="#06b6d4" />
              {unreadNotificationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Body View */}
        <div style={{ padding: '36px', flex: 1 }}>
          {activeMenuItem === 'home' && (
            <DoctorList
              userDoctorId={userdata?._id}
              doctors={doctors}
              userdata={userdata}
              onBookingComplete={fetchDashboardData}
            />
          )}

          {activeMenuItem === 'appointments' && (
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Appointments</h2>

              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <Calendar size={40} color="#475569" style={{ marginBottom: '10px' }} />
                  <p>You have no appointments booked yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '12px' }}>Doctor</th>
                        <th style={{ padding: '12px' }}>Specialization</th>
                        <th style={{ padding: '12px' }}>Date & Time</th>
                        <th style={{ padding: '12px' }}>Attachment</th>
                        <th style={{ padding: '12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((app) => (
                        <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '14px 12px', fontWeight: '600' }}>
                            {app.docName || app.doctorInfo?.fullName || 'Doctor'}
                          </td>
                          <td style={{ padding: '14px 12px', color: '#38bdf8' }}>
                            {app.doctorInfo?.specialization || 'Specialist'}
                          </td>
                          <td style={{ padding: '14px 12px' }}>{app.date}</td>
                          <td style={{ padding: '14px 12px' }}>
                            {app.document ? (
                              <span style={{ color: '#34d399', fontSize: '0.85rem' }}>✓ Uploaded</span>
                            ) : (
                              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>None</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span className={`badge badge-${app.status?.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeMenuItem === 'applyDoctor' && (
            <ApplyDoctor
              userId={userdata?._id}
              userdata={userdata}
              onApplicationSubmitted={fetchDashboardData}
            />
          )}

          {activeMenuItem === 'doctorPortal' && userdata?.isdoctor && (
            <DoctorDashboard userdata={userdata} />
          )}

          {activeMenuItem === 'notifications' && (
            <Notification userdata={userdata} setUserdata={setUserdata} />
          )}
        </div>
      </main>
    </div>
  );
}
