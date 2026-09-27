/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SpaProvider, useSpa } from './context/SpaContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { PosView } from './components/pos/PosView';
import { ClientsView } from './components/clients/ClientsView';
import { RoomsView } from './components/rooms/RoomsView';
import { ServicesView } from './components/services/ServicesView';
import { StaffView } from './components/staff/StaffView';
import { InventoryView } from './components/inventory/InventoryView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { AppointmentDetailModal } from './components/modals/AppointmentDetailModal';
import { Appointment, Client } from './types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const SpaApp: React.FC = () => {
  const { activeView, setActiveView, toasts, removeToast } = useSpa();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);

  // Handle direct appointment booking for a specific client
  const handleBookForClient = (client: Client) => {
    setIsNewAppointmentOpen(true);
  };

  // Handle direct jump from appointment detail to checkout
  const handleProceedToCheckout = (appointment: Appointment) => {
    setCheckoutAppointment(appointment);
    setActiveView('pos');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            onProceedToCheckout={handleProceedToCheckout}
          />
        );
      case 'calendar':
        return (
          <AppointmentsView
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          />
        );
      case 'pos':
        return (
          <PosView
            initialAppointment={checkoutAppointment}
            onClearInitialAppointment={() => setCheckoutAppointment(null)}
          />
        );
      case 'clients':
        return <ClientsView onBookForClient={handleBookForClient} />;
      case 'rooms':
        return <RoomsView />;
      case 'services':
        return <ServicesView />;
      case 'staff':
        return <StaffView />;
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            onProceedToCheckout={handleProceedToCheckout}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden flex-col bg-[#0c0d0e] text-stone-100">
      {/* Top Header */}
      <Header
        onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 w-full max-w-full overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Viewport Content */}
        <main className="flex-1 w-full max-w-full min-w-0 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 md:p-8 pb-24 md:pb-12">
          <div className="mx-auto max-w-7xl w-full">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
      />

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
          let border = 'border-emerald-900/60 bg-stone-900/95';

          if (toast.type === 'error') {
            icon = <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
            border = 'border-rose-900/60 bg-stone-900/95';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
            border = 'border-amber-900/60 bg-stone-900/95';
          } else if (toast.type === 'info') {
            icon = <Info className="h-4 w-4 text-sky-400 shrink-0" />;
            border = 'border-sky-900/60 bg-stone-900/95';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border ${border} shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 text-xs text-stone-200`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SpaProvider>
      <SpaApp />
    </SpaProvider>
  );
}
