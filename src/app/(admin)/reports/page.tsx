import Header from '@/components/Header';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import ProfitLossReportsClient from '@/components/ProfitLossReportsClient';

export default async function ReportsPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { saleDate: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div>
      <Header title="Profit & Loss Reports" />
      <ProfitLossReportsClient sales={sales as any} />
    </div>
  );
}
