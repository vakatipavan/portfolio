'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCharts({ sales, products }: { sales: any[], products: any[] }) {
  const now = new Date();

  // 1. Last 7 Days Sales Trend (Line Chart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailySalesData = last7Days.map(day => {
    return sales
      .filter(s => {
        const d = new Date(s.saleDate);
        return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
      })
      .reduce((sum, sale) => sum + sale.totalAmount, 0);
  });

  const lineChartData = {
    labels: last7Days.map(d => format(d, 'MMM dd')),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dailySalesData,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.4)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // 2. Revenue vs Cost vs Profit (Bar Chart) - Grouped by Daily, Weekly, Monthly, Annual
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

  const getPeriodStats = (filterFn: (saleDate: Date) => boolean) => {
    const filtered = sales.filter(s => filterFn(new Date(s.saleDate)));
    const revenue = filtered.reduce((sum, s) => sum + s.totalAmount, 0);
    const cost = filtered.reduce((sum, s) => sum + s.totalCost, 0);
    const profit = filtered.reduce((sum, s) => sum + s.profit, 0);
    return { revenue, cost, profit };
  };

  const dailyFin = getPeriodStats(d => d >= startOfToday);
  const weeklyFin = getPeriodStats(d => d >= sevenDaysAgo);
  const monthlyFin = getPeriodStats(d => d >= startOfMonth);
  const annualFin = getPeriodStats(d => d >= startOfYear);

  const barChartData = {
    labels: ['Today (Daily)', 'Week (Last 7d)', 'Month (This Mo)', 'Year (Annual)'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [dailyFin.revenue, weeklyFin.revenue, monthlyFin.revenue, annualFin.revenue],
        backgroundColor: '#4F46E5',
        borderRadius: 6,
      },
      {
        label: 'Cost (₹)',
        data: [dailyFin.cost, weeklyFin.cost, monthlyFin.cost, annualFin.cost],
        backgroundColor: '#F59E0B',
        borderRadius: 6,
      },
      {
        label: 'Net Profit (₹)',
        data: [dailyFin.profit, weeklyFin.profit, monthlyFin.profit, annualFin.profit],
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  };

  // 3. Inventory by Category (Doughnut Chart) with multi-size packet support
  const categories = Array.from(new Set(products.map(p => p.category)));
  const categoryData = categories.map(cat => {
    return products
      .filter(p => p.category === cat)
      .reduce((sum, p) => {
        if (p.variants && p.variants.length > 0) {
          return sum + p.variants.reduce((vSum: number, v: any) => vSum + v.stockQuantity, 0);
        }
        return sum + p.stockQuantity;
      }, 0);
  });

  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
  ];

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: categoryData,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginTop: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      
      {/* 1. Daily Trend */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          7-Day Sales Trend
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Daily revenue pattern over the past week
        </p>
        <div style={{ height: '280px' }}>
          <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      </div>
      
      {/* 2. Daily, Weekly, Monthly, Annual Comparison Chart */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          Profit & Loss by Period
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Compare Revenue, Cost & Profit across Daily, Weekly, Monthly & Annual
        </p>
        <div style={{ height: '280px' }}>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* 3. Category Stock Breakdown */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          Inventory Stock by Category
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Total unit distribution across item categories
        </p>
        <div style={{ height: '260px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
