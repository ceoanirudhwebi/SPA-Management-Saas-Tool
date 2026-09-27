import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Appointment, TreatmentRoom, RoomStatus, SaleTransaction } from '../../types';
import { renderBrandIcon } from '../../utils/theme';
import {
  Calendar,
  CreditCard,
  DoorOpen,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  ShoppingBag,
  Sliders,
  DollarSign,
  TrendingUp,
  Receipt,
  User,
  X,
  Check,
  ChevronRight,
  Flame,
  PieChart
} from 'lucide-react';
import { ReceiptModal } from '../modals/ReceiptModal';

interface DashboardViewProps {
  onOpenNewAppointment: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
  onProceedToCheckout: (appointment: Appointment) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewAppointment,
  onSelectAppointment,
  onProceedToCheckout,
}) => {
  const {
    settings,
    theme,
    appointments,
    selectedDate,
    rooms,
    therapists,
    inventory,
    transactions,
    updateAppointmentStatus,
    updateRoomStatus,
    setActiveView,
    formatPrice,
    updateSettings,
  } = useSpa();

  // Widget customizer modal state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<SaleTransaction | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  // Widget config from settings with fallbacks
  const widgets = settings.dashboardWidgets || {
    showKpiStats: true,
    showQuickActions: true,
    showSuitesStatus: true,
    showTodaySchedule: true,
    showCategoryBreakdown: true,
    showRecentTransactions: true,
  };

  const toggleWidget = (key: keyof typeof widgets) => {
    updateSettings({
      dashboardWidgets: {
        ...widgets,
        [key]: !widgets[key],
      },
    });
  };

  // Calculations for today
  const todayAppointments = appointments.filter((a) => a.date === selectedDate);
  const inProgressApts = todayAppointments.filter((a) => a.status === 'in_progress');
  const completedApts = todayAppointments.filter((a) => a.status === 'completed');
  const confirmedApts = todayAppointments.filter((a) => a.status === 'confirmed');

  // Revenue today from appointments and retail transactions
  const appointmentRevenueToday = todayAppointments
    .filter((a) => a.status === 'completed' || a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.price, 0);

  const transactionsToday = transactions.filter((t) => t.date.startsWith(selectedDate));
  const totalPosRevenueToday = transactionsToday.reduce((sum, t) => sum + t.total, 0);

  // Overall estimated gross sales for today
  const grossEstimatedToday = Math.max(
    totalPosRevenueToday,
    appointmentRevenueToday + (totalPosRevenueToday > 0 ? totalPosRevenueToday * 0.3 : 0)
  );

  // Room status counts
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  // Active staff
  const activeTherapistsCount = therapists.filter((t) => t.isActive).length;

  // Low stock inventory
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);

  // Filtered today appointments for display
  const displayAppointments = todayAppointments.filter((apt) => {
    if (scheduleFilter === 'active') return apt.status === 'in_progress';
    if (scheduleFilter === 'upcoming') return apt.status === 'confirmed';
    if (scheduleFilter === 'completed') return apt.status === 'completed';
    return true;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Category breakdown
  const categoryCounts: Record<string, { count: number; revenue: number; label: string }> = {};
  todayAppointments.forEach((apt) => {
    const key = apt.serviceName || 'General Wellness';
    if (!categoryCounts[key]) {
      categoryCounts[key] = { count: 0, revenue: 0, label: apt.serviceName };
    }
    categoryCounts[key].count += 1;
    categoryCounts[key].revenue += apt.price;
  });

  const categoryList = Object.values(categoryCounts).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxCategoryRevenue = Math.max(...categoryList.map((c) => c.revenue), 1);

  // Greetings logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'in_progress':
        return { label: 'In Treatment', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'completed':
        return { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      default:
        return { label: status, color: 'text-stone-400 bg-stone-500/10 border-stone-500/30' };
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-full overflow-hidden">
      {/* Top Banner: Greeting, Sanctuary Status & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 sm:p-5 backdrop-blur-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${theme.lightBg} ${theme.accentText} border ${theme.accentBorder}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sanctuary Console
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className={`mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-stone-100 ${settings.fontDisplay === 'sans' ? 'font-sans' : 'font-serif'}`}>
            {getGreeting()}, <span className={theme.accentText}>{settings.spaName}</span>
          </h1>
          <p className="text-xs text-stone-400 mt-0.5 truncate">
            {todayAppointments.length} sessions booked today · {occupiedRooms} of {rooms.length} suites actively occupied
          </p>
        </div>

        {/* Action buttons on top banner */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs font-medium text-stone-300 hover:bg-stone-800 hover:text-stone-100 transition-colors shadow-sm"
            title="Configure Dashboard Widgets"
          >
            <Sliders className="h-3.5 w-3.5 text-stone-400" />
            <span className="hidden xs:inline">Customize</span>
          </button>

          <button
            onClick={onOpenNewAppointment}
            className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-3.5 py-2 text-xs font-semibold shadow-sm transition-all active:scale-[0.98] whitespace-nowrap`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Book Treatment</span>
          </button>
        </div>
      </div>

      {/* Widget 1: KPI Stats Grid */}
      {widgets.showKpiStats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {/* Card 1: Today's Revenue */}
          <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 relative overflow-hidden group hover:border-stone-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400">Today's Revenue</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.lightBg} ${theme.accentText}`}>
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-100 tabular-nums">
                {formatPrice(grossEstimatedToday)}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                <span>Active billing ({transactionsToday.length} POS sales)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Today's Sessions */}
          <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 relative overflow-hidden group hover:border-stone-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400">Today's Bookings</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-100 tabular-nums">
                {todayAppointments.length} <span className="text-xs font-normal text-stone-400">sessions</span>
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400 font-mono">
                <span className="text-amber-400">{inProgressApts.length} in-progress</span>
                <span>·</span>
                <span className="text-emerald-400">{completedApts.length} done</span>
              </div>
            </div>
          </div>

          {/* Card 3: Suite Occupancy */}
          <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 relative overflow-hidden group hover:border-stone-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400">Suite Occupancy</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <DoorOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-100 tabular-nums">
                  {occupancyRate}%
                </span>
                <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                  {occupiedRooms}/{rooms.length} occupied
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${theme.primaryBg} transition-all duration-500`}
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Staff & Alerts */}
          <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-4 relative overflow-hidden group hover:border-stone-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-400">Staff &amp; Inventory</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="font-serif text-xl sm:text-2xl font-bold text-stone-100 tabular-nums">
                {activeTherapistsCount} <span className="text-xs font-normal text-stone-400">on duty</span>
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                {lowStockItems.length > 0 ? (
                  <button
                    onClick={() => setActiveView('inventory')}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    <Flame className="h-3 w-3" />
                    <span>{lowStockItems.length} low stock alerts</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Inventory stocked</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget 2: Quick Action Dock */}
      {widgets.showQuickActions && (
        <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Operations Quick Dock
            </span>
            <span className="text-[11px] text-stone-500">Rapid Touch Actions</span>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            <button
              onClick={onOpenNewAppointment}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className={`h-8 w-8 rounded-lg ${theme.lightBg} ${theme.accentText} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">New Booking</span>
              <span className="text-[10px] text-stone-500">Schedule session</span>
            </button>

            <button
              onClick={() => setActiveView('pos')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">POS Register</span>
              <span className="text-[10px] text-stone-500">Checkout &amp; Bill</span>
            </button>

            <button
              onClick={() => setActiveView('clients')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">Client CRM</span>
              <span className="text-[10px] text-stone-500">Guests &amp; VIPs</span>
            </button>

            <button
              onClick={() => setActiveView('rooms')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <DoorOpen className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">Suites Board</span>
              <span className="text-[10px] text-stone-500">Room Status</span>
            </button>

            <button
              onClick={() => setActiveView('inventory')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">Boutique</span>
              <span className="text-[10px] text-stone-500">Retail &amp; Oils</span>
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900 transition-all text-center group"
            >
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Sliders className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-stone-200">Settings</span>
              <span className="text-[10px] text-stone-500">Customization</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Dual Grid: Suite Board + Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Today's Appointments Schedule (7 cols) */}
        {widgets.showTodaySchedule && (
          <div className={`${widgets.showSuitesStatus ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className="font-serif text-base font-semibold text-stone-100">
                  Today's Treatment Schedule
                </h3>
                <span className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] font-mono tabular-nums text-stone-300">
                  {displayAppointments.length}
                </span>
              </div>

              {/* Status Segment Filter */}
              <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs overflow-x-auto">
                {(['all', 'active', 'upcoming', 'completed'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setScheduleFilter(filterKey)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors capitalize ${
                      scheduleFilter === filterKey
                        ? `${theme.lightBg} ${theme.accentText} font-semibold`
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Appointments */}
            <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 overflow-hidden divide-y divide-stone-800/60">
              {displayAppointments.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  <Clock className="h-8 w-8 text-stone-600 mx-auto mb-2" />
                  <p className="font-medium text-stone-400">No sessions match current filter</p>
                  <button
                    onClick={onOpenNewAppointment}
                    className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${theme.lightBg} ${theme.accentText} border ${theme.accentBorder} text-xs font-semibold`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Book a session</span>
                  </button>
                </div>
              ) : (
                displayAppointments.map((apt) => {
                  const badge = getStatusBadge(apt.status);
                  return (
                    <div
                      key={apt.id}
                      className="p-3.5 sm:p-4 hover:bg-stone-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Left: Time & Service & Client */}
                      <div
                        onClick={() => onSelectAppointment(apt)}
                        className="cursor-pointer min-w-0 flex-1 group"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-stone-300 tabular-nums bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                            {apt.startTime}–{apt.endTime}
                          </span>
                          <span className={`text-[10px] font-medium border px-1.5 py-0.5 rounded ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="font-serif text-xs font-semibold text-amber-300 tabular-nums">
                            {formatPrice(apt.price)}
                          </span>
                        </div>

                        <h4 className="font-serif text-sm font-semibold text-stone-100 mt-1.5 group-hover:text-amber-300 transition-colors truncate">
                          {apt.serviceName}
                        </h4>

                        <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-400 flex-wrap">
                          <span className="flex items-center gap-1 text-stone-300 font-medium">
                            <User className="h-3 w-3 text-stone-500" />
                            {apt.clientName}
                          </span>
                          <span>·</span>
                          <span className="text-stone-400">{apt.therapistName}</span>
                          <span>·</span>
                          <span className="text-stone-500">{apt.roomName}</span>
                        </div>
                      </div>

                      {/* Right: Quick Action Buttons */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                            title="Start Session"
                          >
                            <Play className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                        )}

                        {apt.status === 'in_progress' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                            title="Mark Session Completed"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Done</span>
                          </button>
                        )}

                        {apt.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => onProceedToCheckout(apt)}
                            className={`flex items-center gap-1 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-2.5 py-1.5 text-[11px] font-bold shadow-sm transition-all whitespace-nowrap`}
                            title="Proceed to POS Billing"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>Checkout</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                            <Check className="h-3 w-3" />
                            <span>Paid</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveView('calendar')}
                className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors"
              >
                <span>Open Full Calendar &amp; Timeline Agenda</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Right Column: Live Suite Status Board (5 cols) */}
        {widgets.showSuitesStatus && (
          <div className={`${widgets.showTodaySchedule ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DoorOpen className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className="font-serif text-base font-semibold text-stone-100">
                  Sanctuary Suites Board
                </h3>
              </div>
              <button
                onClick={() => setActiveView('rooms')}
                className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
              >
                Manage Rooms
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {rooms.map((room) => {
                let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                let dotClass = 'bg-emerald-400';
                let statusLabel = 'Available';

                if (room.status === 'occupied') {
                  badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  dotClass = 'bg-amber-400 animate-pulse';
                  statusLabel = 'In Session';
                } else if (room.status === 'cleaning') {
                  badgeClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
                  dotClass = 'bg-yellow-400';
                  statusLabel = 'Sanitizing';
                } else if (room.status === 'maintenance') {
                  badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                  dotClass = 'bg-rose-400';
                  statusLabel = 'Maintenance';
                }

                return (
                  <div
                    key={room.id}
                    className="p-3 rounded-xl border border-stone-800 bg-stone-900/40 hover:border-stone-700 transition-colors flex flex-col justify-between gap-2.5"
                  >
                    {/* Top Row: Room Name & Status Badge */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass}`} />
                        <h4 className="font-medium text-xs text-stone-200 truncate" title={room.name}>
                          {room.name}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Bottom Row: Room Meta & Action Button */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800/50 text-[11px] text-stone-400 min-w-0">
                      <p className="capitalize truncate flex-1 min-w-0">
                        {room.type.replace('_', ' ')} · Cap: {room.capacity}
                        {room.currentTherapistName && ` · ${room.currentTherapistName}`}
                      </p>

                      {/* Quick status cycle button */}
                      <div className="shrink-0 flex items-center">
                        {room.status === 'cleaning' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'available')}
                            className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold hover:bg-emerald-600/30 transition-colors whitespace-nowrap"
                          >
                            Mark Ready
                          </button>
                        )}
                        {room.status === 'available' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'cleaning')}
                            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] transition-colors whitespace-nowrap"
                            title="Set to Cleaning"
                          >
                            Clean
                          </button>
                        )}
                        {room.status === 'occupied' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'cleaning')}
                            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] transition-colors whitespace-nowrap"
                            title="Finish Session & Clean"
                          >
                            Release
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Category Sales Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Category Breakdown */}
        {widgets.showCategoryBreakdown && (
          <div className={`${widgets.showRecentTransactions ? 'lg:col-span-6' : 'lg:col-span-12'} rounded-2xl border border-stone-800/80 bg-stone-900/30 p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className="font-serif text-base font-semibold text-stone-100">
                  Treatment Demand Today
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">By Service Category</span>
            </div>

            <div className="space-y-3 pt-1">
              {categoryList.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No service bookings yet today</p>
              ) : (
                categoryList.map((cat) => {
                  const percent = Math.round((cat.revenue / maxCategoryRevenue) * 100);
                  return (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-300 font-medium truncate max-w-[200px]">{cat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-500 font-mono">{cat.count} booked</span>
                          <span className="font-serif font-semibold text-amber-300 tabular-nums">
                            {formatPrice(cat.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${theme.primaryBg} transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Recent Transactions Stream */}
        {widgets.showRecentTransactions && (
          <div className={`${widgets.showCategoryBreakdown ? 'lg:col-span-6' : 'lg:col-span-12'} rounded-2xl border border-stone-800/80 bg-stone-900/30 p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className="font-serif text-base font-semibold text-stone-100">
                  Recent POS Settlements
                </h3>
              </div>
              <button
                onClick={() => setActiveView('pos')}
                className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
              >
                Open POS Register
              </button>
            </div>

            <div className="divide-y divide-stone-800/60 pt-1">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-stone-300">
                        {tx.receiptNumber}
                      </span>
                      <span className="text-stone-500 text-[10px] capitalize">
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">
                      {tx.clientName} · {tx.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-serif text-sm font-semibold text-stone-100 tabular-nums">
                      {formatPrice(tx.total)}
                    </span>
                    <button
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                      title="View Receipt"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customize Dashboard Widgets Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sliders className={`h-4 w-4 ${theme.accentText}`} />
                <h3 className="font-serif text-base font-semibold text-stone-100">
                  Customize Dashboard Widgets
                </h3>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-stone-400 hover:text-stone-200 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Personalize your executive dashboard overview. Toggle the widgets you want displayed on mobile and desktop:
            </p>

            <div className="space-y-2.5 divide-y divide-stone-800/60">
              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Revenue &amp; Operations KPI Cards</p>
                  <p className="text-[11px] text-stone-500">Gross revenue, bookings, suite occupancy &amp; stock alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showKpiStats}
                  onChange={() => toggleWidget('showKpiStats')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Operations Quick Dock</p>
                  <p className="text-[11px] text-stone-500">Fast 1-touch buttons for booking, POS, rooms &amp; clients</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showQuickActions}
                  onChange={() => toggleWidget('showQuickActions')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Today's Treatment Schedule</p>
                  <p className="text-[11px] text-stone-500">Chronological agenda stream with 1-click start, complete, &amp; bill</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showTodaySchedule}
                  onChange={() => toggleWidget('showTodaySchedule')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Sanctuary Suites Board</p>
                  <p className="text-[11px] text-stone-500">Live room occupancy, sanitization status, and staff assign</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showSuitesStatus}
                  onChange={() => toggleWidget('showSuitesStatus')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Treatment Demand &amp; Category Breakdown</p>
                  <p className="text-[11px] text-stone-500">Visual progress distribution of booked wellness rituals</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showCategoryBreakdown}
                  onChange={() => toggleWidget('showCategoryBreakdown')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between pt-2 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-stone-200">Recent POS Settlements Feed</p>
                  <p className="text-[11px] text-stone-500">Live feed of completed registers with printable receipts</p>
                </div>
                <input
                  type="checkbox"
                  checked={widgets.showRecentTransactions}
                  onChange={() => toggleWidget('showRecentTransactions')}
                  className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className={`rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-4 py-2 text-xs font-semibold shadow-sm`}
              >
                Apply &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal for recent transactions */}
      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          isOpen={!!selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}
    </div>
  );
};
