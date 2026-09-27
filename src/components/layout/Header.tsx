import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { renderBrandIcon } from '../../utils/theme';
import {
  Calendar as CalendarIcon,
  Plus,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { getOffsetDate } from '../../data/mockData';

interface HeaderProps {
  onOpenNewAppointment: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewAppointment,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const {
    settings,
    theme,
    activeView,
    selectedDate,
    setSelectedDate,
    inventory,
    rooms,
    setActiveView,
  } = useSpa();

  const [alertsOpen, setAlertsOpen] = useState(false);

  // Compute pending alerts
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);
  const roomsNeedingClean = rooms.filter((room) => room.status === 'cleaning');
  const totalAlerts = lowStockItems.length + roomsNeedingClean.length;

  const getViewTitle = (viewKey: string) => {
    switch (viewKey) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'calendar':
        return 'Appointments & Schedule';
      case 'clients':
        return 'Client Directory & CRM';
      case 'services':
        return 'Treatment Menu & Rituals';
      case 'staff':
        return 'Therapists & Staff Roster';
      case 'rooms':
        return 'Sanctuary Rooms & Suites';
      case 'pos':
        return 'POS Checkout & Billing';
      case 'inventory':
        return 'Boutique & Retail Inventory';
      case 'analytics':
        return 'Revenue & Performance Analytics';
      case 'settings':
        return 'Sanctuary Customization';
      default:
        return 'Management Console';
    }
  };

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getOffsetDate(0));
  };

  const formattedDateDisplay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    const isToday = selectedDate === getOffsetDate(0);
    const dayStr = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return isToday ? `Today · ${dayStr}` : dayStr;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full max-w-full box-border items-center justify-between border-b border-stone-800/80 bg-stone-950/95 px-2.5 sm:px-4 md:px-6 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark with brand presence */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 max-w-[50%] sm:max-w-none overflow-hidden pr-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-800 text-stone-300 hover:bg-stone-900 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Brand Icon & Title */}
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 min-w-0 cursor-pointer group"
          title="Sanctuary Home"
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.lightBg} border ${theme.accentBorder} ${theme.accentText} shadow-inner group-hover:scale-105 transition-transform`}>
            {renderBrandIcon(settings.brandIcon || 'sparkles', 'h-4 w-4')}
          </div>
          <span className={`${settings.fontDisplay === 'sans' ? 'font-sans' : 'font-serif'} text-sm sm:text-base font-semibold tracking-wide text-stone-100 truncate`}>
            {settings.spaName}
          </span>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden h-4 w-[1px] bg-stone-800 xl:block mx-1 shrink-0" />

        <div className="hidden items-center gap-1.5 text-xs text-stone-400 xl:flex shrink-0">
          <span className="text-stone-500">Sanctuary</span>
          <span aria-hidden="true" className="text-stone-600">/</span>
          <span className="font-medium text-stone-200">{getViewTitle(activeView)}</span>
        </div>
      </div>

      {/* Zone 2: Date Selector (Shown on lg+ desktop view so it never pushes zone 3 on smaller screens) */}
      <div className="hidden lg:flex items-center gap-1 shrink-0 mx-2">
        <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs text-stone-300">
          <button
            onClick={handlePrevDay}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-stone-800 hover:text-stone-100 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleToday}
            className={`px-2 py-1 font-medium hover:${theme.accentText} transition-colors tabular-nums text-xs`}
          >
            {formattedDateDisplay()}
          </button>

          <button
            onClick={handleNextDay}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-stone-800 hover:text-stone-100 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Zone 3: Always visible, strictly shrink-0, guaranteed within viewport */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto pl-1 sm:pl-2">
        {/* Alerts dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700 hover:bg-stone-800 transition-colors"
            aria-label="Alerts"
          >
            <Bell className="h-4 w-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white shadow-sm tabular-nums">
                {totalAlerts}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="fixed left-3 right-3 top-16 sm:left-auto sm:right-0 sm:top-full sm:absolute sm:mt-2 sm:w-80 rounded-xl border border-stone-800 bg-stone-900 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Operational Alerts
                </span>
                <button
                  onClick={() => setAlertsOpen(false)}
                  className="text-stone-500 hover:text-stone-300 text-xs p-1"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {totalAlerts === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-500">
                    All suites prepared and inventory fully stocked.
                  </div>
                ) : (
                  <>
                    {roomsNeedingClean.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => {
                          setActiveView('rooms');
                          setAlertsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-950/70 border border-amber-900/40 cursor-pointer hover:border-amber-700/60 transition-colors"
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-stone-200">{room.name}</p>
                          <p className="text-stone-400">Requires sanitization &amp; fresh linens</p>
                        </div>
                      </div>
                    ))}

                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveView('inventory');
                          setAlertsOpen(false);
                        }}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-950/70 border border-red-900/40 cursor-pointer hover:border-red-700/60 transition-colors"
                      >
                        <Flame className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-stone-200">{item.name}</p>
                          <p className="text-red-400">
                            Low stock: {item.stock} left (min: {item.minStock})
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Booking Button - Uses dynamic theme styling */}
        <button
          onClick={onOpenNewAppointment}
          className={`flex items-center justify-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-2.5 sm:px-3.5 py-2 text-xs font-semibold shadow-sm active:scale-[0.98] transition-all whitespace-nowrap shrink-0`}
          title="Book Treatment Session"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Book Treatment</span>
          <span className="sm:hidden">Book</span>
        </button>
      </div>
    </header>
  );
};
