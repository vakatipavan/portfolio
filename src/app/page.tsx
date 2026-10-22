'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [logoClicks, setLogoClicks] = useState(0);

  // Hidden triple-tap on the logo for mobile devices without a keyboard
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      setLogoClicks(0);
      router.push('/admin');
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 1500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Inter, sans-serif'
    }}>
      {/* Store Branding (triple-click secret for touchscreen mobile) */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          onClick={handleLogoClick}
          title="Retail Store"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', backgroundColor: '#4F46E5', borderRadius: '20px',
            marginBottom: '1rem', boxShadow: '0 0 40px rgba(79,70,229,0.4)',
            cursor: 'default', userSelect: 'none'
          }}
        >
          <ShoppingCart size={36} color="white" />
        </div>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Retail Store
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>
          Quality Products • Multiple Packet Sizes • Instant Billing
        </p>
      </div>

      {/* Customer / Store Portal Card */}
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <Link href="/pos" style={{ textDecoration: 'none', display: 'block' }}>
          <div
            style={{
              backgroundColor: '#4F46E5',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 12px 35px rgba(79,70,229,0.45)',
              textAlign: 'center',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 18px 45px rgba(79,70,229,0.55)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(79,70,229,0.45)';
            }}
          >
            <div style={{
              width: '68px', height: '68px', backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '18px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.25rem'
            }}>
              <ShoppingCart size={34} color="white" />
            </div>

            <h2 style={{ color: 'white', fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Store & Quick Billing
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Explore our full item catalog, select packet weights (50g, 100g, 250g, 1kg), and create bills instantly.
            </p>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '0.75rem 1.75rem',
              color: '#4F46E5',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }}>
              Open Store Catalog & Billing →
            </div>
          </div>
        </Link>
      </div>

      {/* Customer Highlights */}
      <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: ShoppingCart, label: 'Instant 1-Tap Billing' },
          { icon: Package, label: 'Multiple Packet Sizes' },
          { icon: Sparkles, label: 'Transparent Pricing' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
            <Icon size={16} color="#818CF8" /> {label}
          </div>
        ))}
      </div>

      {/* Clean Public Footer (100% invisible admin access) */}
      <footer style={{
        marginTop: '3.5rem',
        color: '#475569',
        fontSize: '0.8rem',
        textAlign: 'center'
      }}>
        © 2026 Retail Store — All rights reserved
      </footer>
    </div>
  );
}
