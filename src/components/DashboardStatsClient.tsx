'use client';

import { useState } from 'react';
import { IndianRupee, Package, ShoppingCart, TrendingUp } from 'lucide-react';

type PeriodStats = {
  revenue: number;
  profit: number;
  billsCount: number;
};

export default function DashboardStatsClient({
  daily,
  weekly,
  monthly,
  annual,
  allTime,
  totalProductsCount,
  totalInventoryValue,
  totalInventoryUnits
}: {
  daily: PeriodStats;
  weekly: PeriodStats;
  monthly: PeriodStats;
  annual: PeriodStats;
  allTime: PeriodStats;
  totalProductsCount: number;
  totalInventoryValue: number;
  totalInventoryUnits: number;
}) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'annual' | 'all'>('daily');

  const current = {
    daily,
    weekly,
    monthly,
    annual,
    all: allTime
  }[period];

  const periodLabels = {
    daily: "Today's",
    weekly: "This Week's (7 Days)",
    monthly: "This Month's",
    annual: "This Year's (Annual)",
    all: "All Time"
  };

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Period Selection Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        backgroundColor: '#1E293B',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>
            Filter Metrics:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['daily', 'weekly', 'monthly', 'annual', 'all'] as const).map((p) => {
              const isActive = period === p;
              const names = {
                daily: '📅 Daily (Today)',
                weekly: '📆 Weekly (7d)',
                monthly: '🗓️ Monthly',
                annual: '📈 Annual',
                all: '🌐 All Time'
              };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#4F46E5' : '#334155',
                    color: isActive ? 'white' : '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {names[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick profit overview pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#94A3B8' }}>{periodLabels[period]} Profit Margin:</span>
          <span style={{
            fontWeight: 700,
            color: current.profit >= 0 ? '#4ADE80' : '#F87171',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px'
          }}>
            {current.revenue > 0 ? ((current.profit / current.revenue) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
        
        {/* Revenue */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {periodLabels[period]} Sales
            </h3>
            <div style={{ color: 'var(--primary-color)' }}><ShoppingCart size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800 }}>₹{current.revenue.toFixed(2)}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {current.billsCount} bills completed
          </span>
        </div>
        
        {/* Profit */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {periodLabels[period]} Profit
            </h3>
            <div style={{ color: current.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              <IndianRupee size={20} />
            </div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: current.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {current.profit >= 0 ? '+' : ''}₹{current.profit.toFixed(2)}
          </p>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: current.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {current.profit >= 0 ? 'Net positive gain' : 'Net loss'}
          </span>
        </div>
        
        {/* Products */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Products</h3>
            <div style={{ color: 'var(--text-secondary)' }}><Package size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800 }}>{totalProductsCount}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {totalInventoryUnits} total stock units
          </span>
        </div>
        
        {/* Inventory Value */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Inventory Value</h3>
            <div style={{ color: 'var(--warning-color)' }}><IndianRupee size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800 }}>₹{totalInventoryValue.toFixed(2)}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Total wholesale capital
          </span>
        </div>
      </div>

      {/* Side-by-side 4-Period Profit Comparison Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0.85rem 1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Today's Profit
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.1rem 0 0', color: daily.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            ₹{daily.profit.toFixed(2)}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Weekly Profit (7d)
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.1rem 0 0', color: weekly.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            ₹{weekly.profit.toFixed(2)}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Monthly Profit
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.1rem 0 0', color: monthly.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            ₹{monthly.profit.toFixed(2)}
          </p>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Annual Profit
          </span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.1rem 0 0', color: annual.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            ₹{annual.profit.toFixed(2)}
          </p>
        </div>
      </div>

    </div>
  );
}
