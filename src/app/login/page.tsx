'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@shop.com' && password === 'admin123') {
      const res = await fetch('/api/auth', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleAutoFill = () => {
    setEmail('admin@shop.com');
    setPassword('admin123');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <ShoppingCart size={48} color="var(--primary-color)" style={{ margin: '0 auto', marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Owner Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ color: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="admin@shop.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.25rem' }}>
            Sign In
          </button>
        </form>

        {/* Sample Credentials Box */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.9rem 1rem',
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <KeyRound size={14} color="var(--primary-color)" /> Sample Admin Credentials:
            </span>
            <button
              type="button"
              onClick={handleAutoFill}
              style={{
                background: '#EEF2FF',
                color: 'var(--primary-color)',
                border: '1px solid #C7D2FE',
                borderRadius: '6px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Auto-fill
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div>Email: <code style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>admin@shop.com</code></div>
            <div>Password: <code style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-color)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>admin123</code></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
