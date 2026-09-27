import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  X,
  Clock,
  Calendar,
  User,
  DoorOpen,
  Sparkles,
  CreditCard,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (appointment: Appointment) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { updateAppointmentStatus, deleteAppointment, formatPrice, theme } = useSpa();

  if (!isOpen || !appointment) return null;

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, newStatus);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove this appointment for ${appointment.clientName}?`)) {
      deleteAppointment(appointment.id);
      onClose();
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'in_progress':
        return 'text-amber-400';
      case 'completed':
        return 'text-emerald-400';
      case 'confirmed':
        return 'text-sky-400';
      case 'cancelled':
        return 'text-rose-400';
      case 'no_show':
        return 'text-stone-500';
      default:
        return 'text-stone-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 bg-stone-950/60">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-xs uppercase tracking-wider ${getStatusColor(appointment.status)}`}>
              ● {appointment.status.replace('_', ' ')}
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {appointment.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Service Title & Price */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-xl font-semibold text-stone-100">
                {appointment.serviceName}
              </h3>
              <p className="text-stone-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-stone-500" />
                <span>
                  {appointment.startTime} – {appointment.endTime} ({appointment.duration} min)
                </span>
                <span className="text-stone-600">·</span>
                <Calendar className="h-3.5 w-3.5 text-stone-500" />
                <span>{appointment.date}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif text-xl font-semibold text-amber-300 tabular-nums">
                {formatPrice(appointment.price)}
              </span>
            </div>
          </div>

          {/* Client & Staff Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3">
              <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                Client
              </span>
              <p className="font-medium text-stone-200 text-sm">{appointment.clientName}</p>
              <p className="text-stone-400 text-[11px] mt-0.5">{appointment.clientPhone}</p>
              {appointment.clientEmail && (
                <p className="text-stone-500 text-[10px] truncate">{appointment.clientEmail}</p>
              )}
            </div>

            <div className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3">
              <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                Assigned Therapist & Suite
              </span>
              <p className="font-medium text-stone-200 text-sm">{appointment.therapistName}</p>
              <p className="text-stone-400 text-[11px] mt-0.5 flex items-center gap-1">
                <DoorOpen className="h-3 w-3 text-stone-500" />
                {appointment.roomName}
              </p>
            </div>
          </div>

          {/* Allergy Notice if present */}
          {appointment.allergyNotice && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-900/50 bg-amber-950/20 p-3 text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">Allergy & Sensitivity Alert</span>
                <span className="text-[11px] text-amber-200/90">{appointment.allergyNotice}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="rounded-xl border border-stone-800/80 bg-stone-950/40 p-3">
              <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                Treatment Notes & Special Requests
              </span>
              <p className="text-stone-300 text-xs italic">{appointment.notes}</p>
            </div>
          )}

          {/* Quick Status Action Controls */}
          <div className="pt-2 border-t border-stone-800">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-2">
              Update Appointment Lifecycle
            </span>
            <div className="grid grid-cols-3 gap-2">
              {appointment.status !== 'in_progress' && appointment.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-medium"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Start Session</span>
                </button>
              )}

              {appointment.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Complete</span>
                </button>
              )}

              {appointment.status !== 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Confirmed</span>
                </button>
              )}

              {appointment.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 font-medium"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-stone-500 hover:text-rose-400 text-xs transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              >
                Close
              </button>
              {appointment.paymentStatus === 'unpaid' && (
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout(appointment);
                  }}
                  className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-4 py-2 font-medium shadow-sm transition-all`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed to POS Checkout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
