import Header from '@/components/Header';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { AlertCircle, ShoppingCart, Sparkles, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

import DashboardCharts from '@/components/DashboardCharts';
import DashboardStatsClient from '@/components/DashboardStatsClient';

export default async function Dashboard() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

  const [
    totalProductsCount,
    products,
    allSales
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      include: { variants: true }
    }),
    prisma.sale.findMany({
      include: { items: true },
      orderBy: { saleDate: 'desc' }
    })
  ]);

  // Inventory stats
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalInventoryValue = 0;
  let totalInventoryUnits = 0;

  products.forEach(p => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        totalInventoryUnits += v.stockQuantity;
        if (v.stockQuantity === 0) {
          outOfStockCount++;
        } else if (v.stockQuantity <= v.minStock) {
          lowStockCount++;
        }
        totalInventoryValue += v.purchasePrice * v.stockQuantity;
      });
    } else {
      totalInventoryUnits += p.stockQuantity;
      if (p.stockQuantity === 0) {
        outOfStockCount++;
      } else if (p.stockQuantity <= p.minStock) {
        lowStockCount++;
      }
      totalInventoryValue += p.purchasePrice * p.stockQuantity;
    }
  });

  // Calculate stats for daily, weekly, monthly, annual, allTime
  const computePeriod = (filterFn: (date: Date) => boolean) => {
    const subset = allSales.filter(s => filterFn(new Date(s.saleDate)));
    const revenue = subset.reduce((acc, s) => acc + s.totalAmount, 0);
    const profit = subset.reduce((acc, s) => acc + s.profit, 0);
    return {
      revenue,
      profit,
      billsCount: subset.length
    };
  };

  const daily = computePeriod(d => d >= startOfToday);
  const weekly = computePeriod(d => d >= sevenDaysAgo);
  const monthly = computePeriod(d => d >= startOfMonth);
  const annual = computePeriod(d => d >= startOfYear);
  const allTime = {
    revenue: allSales.reduce((acc, s) => acc + s.totalAmount, 0),
    profit: allSales.reduce((acc, s) => acc + s.profit, 0),
    billsCount: allSales.length
  };

  return (
    <div>
      <Header title="Dashboard" />
      
      {/* Interactive Multi-Period Metric Cards (Daily / Weekly / Monthly / Annual / All) */}
      <DashboardStatsClient
        daily={daily}
        weekly={weekly}
        monthly={monthly}
        annual={annual}
        allTime={allTime}
        totalProductsCount={totalProductsCount}
        totalInventoryValue={totalInventoryValue}
        totalInventoryUnits={totalInventoryUnits}
      />

      {/* AI Sales Predictor Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        color: 'white',
        marginBottom: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(79,70,229,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
            <Sparkles size={24} color="#FDE047" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Smart Sales Predictor & AI Restock Advisor</h3>
            <p style={{ fontSize: '0.85rem', color: '#C7D2FE', margin: '0.1rem 0 0 0' }}>
              Groq AI predicts item sales, calculates 30-day demand, and tells you exact quantities to buy for every product.
            </p>
          </div>
        </div>
        <Link 
          href="/predictor"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'white', color: '#4F46E5',
            padding: '0.65rem 1.25rem', borderRadius: '10px',
            fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap', transition: 'transform 0.15s'
          }}
        >
          View Sales Forecast & Reorder List <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="var(--danger-color)" /> Action Required
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--danger-color)' }}>Out of Stock Items</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {outOfStockCount === 0 ? 'All products & sizes in stock' : `${outOfStockCount} item size(s) need immediate restocking`}
                </p>
              </div>
              <Link href="/inventory" className="btn btn-danger">View</Link>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--warning-color)' }}>Low Stock Items</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {lowStockCount === 0 ? 'No low stock alerts' : `${lowStockCount} item size(s) running low`}
                </p>
              </div>
              <Link href="/inventory" className="btn" style={{ backgroundColor: 'var(--warning-color)', color: 'white' }}>View</Link>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
          <div className="grid grid-cols-2">
            <Link href="/billing" className="btn btn-primary" style={{ height: '100px', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <ShoppingCart size={24} /> New Sale
            </Link>
            <Link href="/products/new" className="btn" style={{ backgroundColor: '#10B981', color: 'white', height: '100px', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Package size={24} /> Add Product
            </Link>
          </div>
        </div>
      </div>
      
      {/* Charts (with Daily, Weekly, Monthly, Annual bar comparisons) */}
      <DashboardCharts sales={allSales} products={products} />
    </div>
  );
}
