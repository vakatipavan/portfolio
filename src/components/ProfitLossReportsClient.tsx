'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  IndianRupee, TrendingUp, TrendingDown, Activity,
  Calendar, ShoppingBag, Receipt, ArrowRight, BarChart2
} from 'lucide-react';
import Link from 'next/link';

type SaleWithItems = {
  id: string;
  totalAmount: number;
  totalCost: number;
  profit: number;
  saleDate: string | Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    cost: number;
    product: {
      name: string;
      unit: string;
    };
  }[];
};

type Period = 'daily' | 'weekly' | 'monthly' | 'annual' | 'all';

export default function ProfitLossReportsClient({ sales }: { sales: SaleWithItems[] }) {
  const [activePeriod, setActivePeriod] = useState<Period>('daily');

  // Compute boundaries
  const now = new Date();

  // 1. Daily: today from 00:00:00
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // 2. Weekly: last 7 days from 00:00:00
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 3. Monthly: start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  // 4. Annual: start of current year
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

  // Helper to compute stats for any list of sales
  const computeStats = (filtered: SaleWithItems[]) => {
    const revenue = filtered.reduce((acc, s) => acc + s.totalAmount, 0);
    const cost = filtered.reduce((acc, s) => acc + s.totalCost, 0);
    const profit = filtered.reduce((acc, s) => acc + s.profit, 0);
    const count = filtered.length;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const avgBill = count > 0 ? revenue / count : 0;
    return { revenue, cost, profit, count, margin, avgBill };
  };

  // Pre-calculate stats for all 4 periods for quick comparison cards
  const dailySales = useMemo(() => sales.filter(s => new Date(s.saleDate) >= startOfToday), [sales, startOfToday]);
  const weeklySales = useMemo(() => sales.filter(s => new Date(s.saleDate) >= sevenDaysAgo), [sales, sevenDaysAgo]);
  const monthlySales = useMemo(() => sales.filter(s => new Date(s.saleDate) >= startOfMonth), [sales, startOfMonth]);
  const annualSales = useMemo(() => sales.filter(s => new Date(s.saleDate) >= startOfYear), [sales, startOfYear]);

  const dailyStats = useMemo(() => computeStats(dailySales), [dailySales]);
  const weeklyStats = useMemo(() => computeStats(weeklySales), [weeklySales]);
  const monthlyStats = useMemo(() => computeStats(monthlySales), [monthlySales]);
  const annualStats = useMemo(() => computeStats(annualSales), [annualSales]);
  const allStats = useMemo(() => computeStats(sales), [sales]);

  // Active filtered sales
  const currentSales = useMemo(() => {
    switch (activePeriod) {
      case 'daily': return dailySales;
      case 'weekly': return weeklySales;
      case 'monthly': return monthlySales;
      case 'annual': return annualSales;
      case 'all': return sales;
    }
  }, [activePeriod, dailySales, weeklySales, monthlySales, annualSales, sales]);

  const currentStats = useMemo(() => computeStats(currentSales), [currentSales]);

  const periodLabels: Record<Period, { title: string; subtitle: string }> = {
    daily: { title: 'Daily (Today)', subtitle: 'Transactions from today (since midnight)' },
    weekly: { title: 'Weekly (Last 7 Days)', subtitle: 'Transactions over the last 7 days' },
    monthly: { title: 'Monthly (This Month)', subtitle: `Transactions for ${format(now, 'MMMM yyyy')}` },
    annual: { title: 'Annual (This Year)', subtitle: `Transactions for ${now.getFullYear()}` },
    all: { title: 'All Time (Whole)', subtitle: 'All sales transactions recorded in store' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* 4-Period At-A-Glance Comparison Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Profit & Loss Summary By Period
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click any card to inspect details</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          {/* Daily Card */}
          <div
            onClick={() => setActivePeriod('daily')}
            className="card"
            style={{
              cursor: 'pointer',
              border: `2px solid ${activePeriod === 'daily' ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: activePeriod === 'daily' ? '#EEF2FF' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activePeriod === 'daily' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                📅 DAILY (TODAY)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                {dailyStats.count} bills
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: dailyStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '0.25rem' }}>
              {dailyStats.profit >= 0 ? '+' : ''}₹{dailyStats.profit.toFixed(2)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Sales: ₹{dailyStats.revenue.toFixed(0)}</span>
              <span>Margin: {dailyStats.margin.toFixed(1)}%</span>
            </div>
          </div>

          {/* Weekly Card */}
          <div
            onClick={() => setActivePeriod('weekly')}
            className="card"
            style={{
              cursor: 'pointer',
              border: `2px solid ${activePeriod === 'weekly' ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: activePeriod === 'weekly' ? '#EEF2FF' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activePeriod === 'weekly' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                📆 WEEKLY (7 DAYS)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                {weeklyStats.count} bills
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: weeklyStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '0.25rem' }}>
              {weeklyStats.profit >= 0 ? '+' : ''}₹{weeklyStats.profit.toFixed(2)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Sales: ₹{weeklyStats.revenue.toFixed(0)}</span>
              <span>Margin: {weeklyStats.margin.toFixed(1)}%</span>
            </div>
          </div>

          {/* Monthly Card */}
          <div
            onClick={() => setActivePeriod('monthly')}
            className="card"
            style={{
              cursor: 'pointer',
              border: `2px solid ${activePeriod === 'monthly' ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: activePeriod === 'monthly' ? '#EEF2FF' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activePeriod === 'monthly' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                🗓️ MONTHLY ({format(now, 'MMM')})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                {monthlyStats.count} bills
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: monthlyStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '0.25rem' }}>
              {monthlyStats.profit >= 0 ? '+' : ''}₹{monthlyStats.profit.toFixed(2)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Sales: ₹{monthlyStats.revenue.toFixed(0)}</span>
              <span>Margin: {monthlyStats.margin.toFixed(1)}%</span>
            </div>
          </div>

          {/* Annual Card */}
          <div
            onClick={() => setActivePeriod('annual')}
            className="card"
            style={{
              cursor: 'pointer',
              border: `2px solid ${activePeriod === 'annual' ? 'var(--primary-color)' : 'var(--border-color)'}`,
              backgroundColor: activePeriod === 'annual' ? '#EEF2FF' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: activePeriod === 'annual' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                📈 ANNUAL ({now.getFullYear()})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                {annualStats.count} bills
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: annualStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', marginBottom: '0.25rem' }}>
              {annualStats.profit >= 0 ? '+' : ''}₹{annualStats.profit.toFixed(2)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Sales: ₹{annualStats.revenue.toFixed(0)}</span>
              <span>Margin: {annualStats.margin.toFixed(1)}%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
          Select Period Filter:
        </span>
        {(['daily', 'weekly', 'monthly', 'annual', 'all'] as Period[]).map((p) => {
          const isActive = activePeriod === p;
          const labels: Record<Period, string> = {
            daily: 'Daily (Today)',
            weekly: 'Weekly (Last 7 Days)',
            monthly: 'Monthly (This Month)',
            annual: `Annual (${now.getFullYear()})`,
            all: 'All Time (Whole)'
          };
          return (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${isActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                backgroundColor: isActive ? 'var(--primary-color)' : 'white',
                color: isActive ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {labels[p]}
            </button>
          );
        })}
      </div>

      {/* Selected Period Metrics Banner */}
      <div style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
          {periodLabels[activePeriod].title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
          {periodLabels[activePeriod].subtitle}
        </p>
      </div>

      {/* Main 4 Metric Cards for Active Period */}
      <div className="grid grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}>
        
        {/* Total Revenue */}
        <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 500, opacity: 0.9 }}>Period Revenue</h3>
            <div><IndianRupee size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800 }}>₹{currentStats.revenue.toFixed(2)}</p>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>{currentStats.count} orders billed</span>
        </div>

        {/* Total Cost */}
        <div className="card" style={{ backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Purchase Cost</h3>
            <div style={{ color: 'var(--text-secondary)' }}><Activity size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{currentStats.cost.toFixed(2)}</p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Wholesale cost of goods</span>
        </div>

        {/* Net Profit / Loss */}
        <div className="card" style={{ backgroundColor: currentStats.profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: currentStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 600 }}>
              Net Profit / Loss
            </h3>
            <div style={{ color: currentStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              {currentStats.profit >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: currentStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            ₹{currentStats.profit.toFixed(2)}
          </p>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: currentStats.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {currentStats.margin.toFixed(1)}% profit margin
          </span>
        </div>

        {/* Order Analytics */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Average Order</h3>
            <div style={{ color: 'var(--warning-color)' }}><Receipt size={20} /></div>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800 }}>₹{currentStats.avgBill.toFixed(2)}</p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Across {currentStats.count} customer bills</span>
        </div>

      </div>

      {/* Transaction List for Active Period */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Transactions in {periodLabels[activePeriod].title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0 0' }}>
              Showing all recorded sales matching this time period
            </p>
          </div>
          <span style={{ backgroundColor: '#EEF2FF', color: 'var(--primary-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
            {currentSales.length} Transactions
          </span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Bill ID</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Items Sold</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Revenue</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Cost</th>
                <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                    {format(new Date(sale.saleDate), 'dd MMM yyyy, p')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    #{sale.id.split('-')[0].toUpperCase()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {sale.items.map(item => (
                        <span key={item.id} style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          • {item.product?.name || 'Item'} <strong style={{ color: 'var(--text-secondary)' }}>×{item.quantity}</strong>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontSize: '0.95rem' }}>
                    ₹{sale.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    ₹{sale.totalCost.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: sale.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)',
                      backgroundColor: sale.profit >= 0 ? '#ECFDF5' : '#FEF2F2',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      {sale.profit >= 0 ? '+' : ''}₹{sale.profit.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              {currentSales.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No sales recorded for {periodLabels[activePeriod].title.toLowerCase()}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
