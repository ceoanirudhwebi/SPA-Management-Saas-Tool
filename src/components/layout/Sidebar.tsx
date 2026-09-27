import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { renderBrandIcon } from '../../utils/theme';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  DoorOpen,
  Sparkles,
  UserCheck,
  Package,
  BarChart3,
  Settings,
  CircleDot
} from 'lucide-react';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { activeView, setActiveView, rooms, therapists, appointments, selectedDate, settings, theme } = useSpa();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Bookings & Agenda', icon: Calendar },
    { id: 'pos', label: 'POS Checkout', icon: CreditCard },
    { id: 'clients', label: 'Client CRM', icon: Users },
    { id: 'rooms', label: 'Treatment Suites', icon: DoorOpen },
    { id: 'services', label: 'Rituals & Services', icon: Sparkles },
    { id: 'staff', label: 'Therapists & Staff', icon: UserCheck },
    { id: 'inventory', label: 'Boutique Inventory', icon: Package },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Customization & Settings', icon: Settings },
  ];

  // Quick live stats
  const occupiedRoomsCount = rooms.filter((r) => r.status === 'occupied').length;
  const activeStaffCount = therapists.filter((t) => t.isActive).length;
  const todayAptsCount = appointments.filter((a) => a.date === selectedDate).length;

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-stone-800/80 bg-stone-950/80 p-4">
        <div className="space-y-6">
          {/* Sanctuary Monogram & Status */}
          <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-3.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className={`flex items-center gap-1.5 font-medium ${theme.accentText}`}>
                <CircleDot className="h-3 w-3 text-emerald-400 animate-pulse" />
                Sanctuary Active
              </span>
              <span className="tabular-nums text-stone-500 font-mono text-[11px]">
                {todayAptsCount} today
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-800/60">
              <div>
                <span className="text-stone-500 block">Suites Occ.</span>
                <span className="font-semibold text-stone-200 tabular-nums">
                  {occupiedRoomsCount} / {rooms.length}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Therapists</span>
                <span className="font-semibold text-stone-200 tabular-nums">
                  {activeStaffCount} on duty
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Main Operations
            </span>
            <div className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? `${theme.lightBg} ${theme.accentText} border ${theme.accentBorder} font-semibold`
                        : 'text-stone-400 hover:bg-stone-900/60 hover:text-stone-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? theme.accentText : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Footer info */}
        <div className="rounded-xl border border-stone-800/60 bg-stone-900/20 p-3 text-[11px] text-stone-500">
          <p className="font-medium text-stone-300 truncate">{settings.spaName}</p>
          <p className="text-stone-500 mt-0.5 truncate">{settings.tagline || 'Customizable SaaS Edition'}</p>
        </div>
      </aside>

      {/* Mobile Drawer (When hamburger menu is opened on mobile) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm md:hidden animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-stone-950 border-r border-stone-800 p-5 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.lightBg} border ${theme.accentBorder} ${theme.accentText}`}>
                  {renderBrandIcon(settings.brandIcon || 'sparkles', 'h-4 w-4')}
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base font-semibold text-stone-100 truncate ${settings.fontDisplay === 'sans' ? 'font-sans' : 'font-serif'}`}>
                    {settings.spaName}
                  </h2>
                  <p className="text-[11px] text-stone-400 truncate">{settings.tagline}</p>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm transition-all ${
                        isActive
                          ? `${theme.lightBg} ${theme.accentText} font-medium border ${theme.accentBorder}`
                          : 'text-stone-300 hover:bg-stone-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? theme.accentText : 'text-stone-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3 text-xs text-stone-500">
              <p>Spa &amp; Salon SAS Platform</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Persistent touch bar for rapid thumb access) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-stone-800/90 bg-stone-950/95 backdrop-blur-lg md:hidden px-2 items-center justify-around">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center justify-center h-12 w-14 rounded-lg text-[10px] font-medium transition-colors ${
            activeView === 'dashboard' ? theme.accentText : 'text-stone-400'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          <span>Console</span>
        </button>

        <button
          onClick={() => setActiveView('calendar')}
          className={`flex flex-col items-center justify-center h-12 w-14 rounded-lg text-[10px] font-medium transition-colors ${
            activeView === 'calendar' ? theme.accentText : 'text-stone-400'
          }`}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span>Agenda</span>
        </button>

        <button
          onClick={() => setActiveView('pos')}
          className={`flex flex-col items-center justify-center h-12 w-14 rounded-lg text-[10px] font-medium transition-colors ${
            activeView === 'pos' ? theme.accentText : 'text-stone-400'
          }`}
        >
          <CreditCard className="h-5 w-5 mb-0.5" />
          <span>Checkout</span>
        </button>

        <button
          onClick={() => setActiveView('rooms')}
          className={`flex flex-col items-center justify-center h-12 w-14 rounded-lg text-[10px] font-medium transition-colors ${
            activeView === 'rooms' ? theme.accentText : 'text-stone-400'
          }`}
        >
          <DoorOpen className="h-5 w-5 mb-0.5" />
          <span>Suites</span>
        </button>

        <button
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center justify-center h-12 w-14 rounded-lg text-[10px] font-medium transition-colors ${
            activeView === 'settings' ? theme.accentText : 'text-stone-400'
          }`}
        >
          <Settings className="h-5 w-5 mb-0.5" />
          <span>Settings</span>
        </button>
      </nav>
    </>
  );
};
