import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, ShieldCheck, UserCheck, ArrowRight, Activity, Clock, Award } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <nav style={{
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Stethoscope size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
            MediCare<span style={{ color: '#06b6d4' }}>Book</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Home</Link>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Login</Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '10px', padding: '8px 18px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 60px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            <Activity size={16} /> Verified Doctors & Instant Scheduling
          </div>

          <h1 style={{ fontSize: '3.4rem', lineHeight: '1.15', marginBottom: '24px' }}>
            Your Health Is Our <br />
            <span className="gradient-text">Top Priority</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '36px', maxWidth: '500px' }}>
            Effortlessly schedule your doctor appointments with verified healthcare specialists in just a few clicks. Manage records, receive real-time updates, and get expert care.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1rem' }}>
              Book Your Doctor Now <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1rem' }}>
              Apply as Healthcare Provider
            </Link>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div style={{ position: 'relative' }}>
          <div className="glass-panel" style={{
            padding: '32px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(18, 24, 38, 0.9), rgba(15, 23, 42, 0.7))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                IK
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Dr. Indrajeet Kadam</h3>
                <p style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: '600' }}>Senior Cardiologist</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <Award size={16} color="#06b6d4" /> Experience
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>12+ Years</div>
              </div>
              <div className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <Clock size={16} color="#10b981" /> Availability
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '4px', color: '#34d399' }}>Today Open</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px dashed rgba(6, 182, 212, 0.4)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Consultation Fee</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>₹500 / Visit</div>
              </div>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.85rem' }}>
                Book Slot
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Overview */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px 24px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '40px' }}>
          Why Choose <span className="gradient-text">MediCareBook</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <UserCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Verified Doctors</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              All medical specialists undergo strict background compliance and verification by platform admins.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Live Slot Availability</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Pick available appointment slots in real-time with instant email & SMS status notifications.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Medical Records & Storage</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Safely upload medical documents and insurance records with your appointment booking.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '30px 40px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.9rem',
        background: 'rgba(11, 15, 25, 0.95)'
      }}>
        © 2026 MediCareBook Platform. All rights reserved. Designed for healthcare excellence.
      </footer>
    </div>
  );
}
