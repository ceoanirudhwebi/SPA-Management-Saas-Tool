import React from 'react';
import { useSpa } from '../../context/SpaContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Award,
  Sparkles,
  CreditCard,
  Clock,
  PieChart
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { transactions, appointments, services, therapists, rooms, formatPrice } = useSpa();

  // Financial aggregates
  const totalGrossRevenue = transactions.reduce((acc, tx) => acc + tx.total, 0);
  const totalTips = transactions.reduce((acc, tx) => acc + tx.tip, 0);
  const totalTax = transactions.reduce((acc, tx) => acc + tx.tax, 0);
  const totalDiscounts = transactions.reduce((acc, tx) => acc + tx.discount, 0);
  const averageTicket = transactions.length ? totalGrossRevenue / transactions.length : 0;

  // Bookings aggregates
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed' || a.status === 'in_progress');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled');

  // Category revenue estimation
  const categoryTotals: Record<string, number> = {};
  services.forEach((s) => {
    categoryTotals[s.category] = 0;
  });

  appointments.forEach((apt) => {
    const srv = services.find((s) => s.id === apt.serviceId);
    if (srv) {
      categoryTotals[srv.category] = (categoryTotals[srv.category] || 0) + apt.price;
    }
  });

  const totalCategoryRevenue = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  // Payment methods breakdown
  const paymentBreakdown = transactions.reduce((acc, tx) => {
    acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + tx.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Overview Heading */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-stone-100">
          Executive Financial &amp; Sanctuary Performance
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">
          Real-time analytics for revenue, suite utilization, practitioner output, and guest retention
        </p>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[10px] tracking-wider font-semibold text-stone-500">
              Gross Sanctuary Revenue
            </span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-serif text-2xl md:text-3xl font-bold text-amber-300 tabular-nums">
            {formatPrice(totalGrossRevenue)}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% compared to last cycle</span>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[10px] tracking-wider font-semibold text-stone-500">
              Average Ticket Size
            </span>
            <Sparkles className="h-4 w-4 text-stone-400" />
          </div>
          <p className="mt-2 font-serif text-2xl md:text-3xl font-bold text-stone-100 tabular-nums">
            {formatPrice(averageTicket)}
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            {transactions.length} processed checkouts
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[10px] tracking-wider font-semibold text-stone-500">
              Treatments Completed
            </span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-serif text-2xl md:text-3xl font-bold text-stone-100 tabular-nums">
            {completedAppointments.length}
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            {confirmedAppointments.length} upcoming / scheduled
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="uppercase text-[10px] tracking-wider font-semibold text-stone-500">
              Therapist Gratuity Pool
            </span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-serif text-2xl md:text-3xl font-bold text-stone-100 tabular-nums">
            {formatPrice(totalTips)}
          </p>
          <p className="mt-1 text-[11px] text-stone-400">
            Directly distributed to staff
          </p>
        </div>
      </div>

      {/* Grid: Category Revenue Distribution & Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Breakdown */}
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h4 className="font-serif text-base font-semibold text-stone-100">
              Revenue by Treatment Category
            </h4>
            <span className="text-xs text-stone-500">All-time bookings</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const percentage = Math.round((amount / totalCategoryRevenue) * 100) || 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-200 capitalize">
                      {cat.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-stone-300 tabular-nums">
                      {formatPrice(amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff / Therapist Performance Leaderboard */}
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h4 className="font-serif text-base font-semibold text-stone-100">
              Top Practitioner Performance
            </h4>
            <span className="text-xs text-stone-500">By revenue generated</span>
          </div>

          <div className="space-y-3">
            {[...therapists]
              .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
              .map((th, index) => (
                <div
                  key={th.id}
                  className="flex items-center justify-between rounded-xl border border-stone-800/80 bg-stone-950/60 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-500 text-sm w-4">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-stone-100">{th.name}</p>
                      <p className="text-[11px] text-stone-400">{th.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-serif font-semibold text-amber-300 tabular-nums">
                      {formatPrice(th.revenueGenerated)}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">
                      {th.appointmentsCount} treatments · ★ {th.rating.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Payment methods & Suite Occupancy summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 space-y-3">
          <h4 className="font-serif text-base font-semibold text-stone-100 border-b border-stone-800 pb-2">
            Tender / Settlement Distribution
          </h4>
          <div className="space-y-2 pt-1 text-xs">
            {Object.entries(paymentBreakdown).map(([method, amount]) => (
              <div
                key={method}
                className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800"
              >
                <span className="capitalize text-stone-300">{method.replace('_', ' ')}</span>
                <span className="font-mono text-amber-300 tabular-nums font-medium">
                  {formatPrice(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 space-y-3">
          <h4 className="font-serif text-base font-semibold text-stone-100 border-b border-stone-800 pb-2">
            Facility Capacity &amp; Chambers
          </h4>
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">Total Treatment Suites</span>
              <span className="font-mono text-stone-100 tabular-nums">{rooms.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">Currently Occupied</span>
              <span className="font-mono text-amber-400 tabular-nums">
                {rooms.filter((r) => r.status === 'occupied').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800">
              <span className="text-stone-300">Awaiting Sanitization</span>
              <span className="font-mono text-sky-400 tabular-nums">
                {rooms.filter((r) => r.status === 'cleaning').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
