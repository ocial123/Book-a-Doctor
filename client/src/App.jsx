import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserHome from './components/UserHome';
import AdminHome from './components/AdminHome';

export default function App() {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user) => {
    setUserData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUserData(null);
    window.location.href = '/login';
  };

  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard Route */}
        <Route
          path="/userhome"
          element={
            token ? (
              <UserHome userdata={userData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/adminhome"
          element={
            token ? (
              <AdminHome userdata={userData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Legacy PDF Route Aliases */}
        <Route path="/user/appointments" element={<Navigate to="/userhome" replace />} />
        <Route path="/notification" element={<Navigate to="/userhome" replace />} />
        <Route path="/admin/doctors" element={<Navigate to="/adminhome" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
