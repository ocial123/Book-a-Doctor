import React, { useState } from 'react';
import axios from 'axios';
import { Bell, CheckCheck, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function Notification({ userdata, setUserdata }) {
  const [activeTab, setActiveTab] = useState('unread');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const notifications = userdata?.notification || [];
  const seenNotifications = userdata?.seennotification || [];

  const handleMarkAllRead = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/getallnotification', {
        userId: userdata?._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage('All notifications marked as read');
        const updated = res.data.data;
        setUserdata(updated);
        localStorage.setItem('userData', JSON.stringify(updated));
      } else {
        setError(res.data.message || 'Failed to update notifications');
      }
    } catch (err) {
      console.error(err);
      setError('Server error updating notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/user/deleteallnotification', {
        userId: userdata?._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage('Notifications deleted successfully');
        const updated = res.data.data;
        setUserdata(updated);
        localStorage.setItem('userData', JSON.stringify(updated));
      } else {
        setError(res.data.message || 'Failed to delete notifications');
      }
    } catch (err) {
      console.error(err);
      setError('Server error deleting notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', borderRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Notification Center</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            System updates, appointment alerts, and status changes
          </p>
        </div>

        {activeTab === 'unread' ? (
          <button
            className="btn-secondary"
            onClick={handleMarkAllRead}
            disabled={loading || notifications.length === 0}
          >
            <CheckCheck size={16} color="#34d399" /> Mark All Read
          </button>
        ) : (
          <button
            className="btn-danger"
            onClick={handleDeleteAll}
            disabled={loading || seenNotifications.length === 0}
          >
            <Trash2 size={16} /> Delete All Notifications
          </button>
        )}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('unread')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: activeTab === 'unread' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
            background: activeTab === 'unread' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'unread' ? '#38bdf8' : '#94a3b8',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Bell size={16} /> Unread ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('seen')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: activeTab === 'seen' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
            background: activeTab === 'seen' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            color: activeTab === 'seen' ? '#60a5fa' : '#94a3b8',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCheck size={16} /> Read / History ({seenNotifications.length})
        </button>
      </div>

      {/* Notification List */}
      {activeTab === 'unread' ? (
        notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Bell size={36} color="#475569" style={{ marginBottom: '10px' }} />
            <p>No new unread notifications</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #06b6d4' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{item.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>
                <span className="badge badge-pending">New</span>
              </div>
            ))}
          </div>
        )
      ) : (
        seenNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <CheckCheck size={36} color="#475569" style={{ marginBottom: '10px' }} />
            <p>No read notifications in history</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {seenNotifications.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.8 }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.95rem', marginBottom: '4px' }}>{item.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Archived'}
                  </div>
                </div>
                <span className="badge badge-scheduled">Read</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
