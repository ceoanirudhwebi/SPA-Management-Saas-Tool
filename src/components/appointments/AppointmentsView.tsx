import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  DoorOpen,
  Filter,
  Plus,
  AlertCircle,
  CheckCircle,
  Play,
  RotateCw,
  Search,
  List,
  Columns,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getOffsetDate } from '../../data/mockData';

interface AppointmentsViewProps {
  onOpenNewAppointment: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenNewAppointment,
  onSelectAppointment,
}) => {
  const {
    appointments,
    selectedDate,
    setSelectedDate,
    therapists,
    rooms,
    formatPrice,
    updateAppointmentStatus,
  } = useSpa();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [therapistFilter, setTherapistFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'timeline' | 'list'>('timeline');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Date handlers
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

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate;
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesTherapist = therapistFilter === 'all' || apt.therapistId === therapistFilter;
    const matchesRoom = roomFilter === 'all' || apt.roomId === roomFilter;
    const matchesSearch =
      !searchQuery ||
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.therapistName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesStatus && matchesTherapist && matchesRoom && matchesSearch;
  });

  // Sort by startTime
  const sortedAppointments = [...filteredAppointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  // Time slots for agenda view (08:00 to 19:00)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in_progress':
        return { label: 'In Treatment', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'completed':
        return { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'no_show':
        return { label: 'No Show', color: 'text-stone-400 bg-stone-500/10 border-stone-500/30' };
      default:
        return { label: status, color: 'text-stone-400 bg-stone-500/10 border-stone-500/30' };
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
      {/* Responsive Date Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-800/80 bg-stone-900/40 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 bg-stone-950 hover:bg-stone-800 text-stone-300 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleToday}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                selectedDate === getOffsetDate(0)
                  ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 bg-stone-950 hover:bg-stone-800 text-stone-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="font-serif text-base sm:text-lg font-semibold text-stone-100 ml-1">
            {formattedDateDisplay()}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
          />
          <span className="text-[11px] text-stone-400 font-mono tabular-nums whitespace-nowrap">
            {sortedAppointments.length} sessions
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search & Select dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search client, service, therapist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900/90 py-1.5 pl-9 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
            />
          </div>

          {/* Therapist filter */}
          <select
            value={therapistFilter}
            onChange={(e) => setTherapistFilter(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-900/90 px-2.5 py-1.5 text-xs text-stone-300 focus:border-amber-500/60 focus:outline-none flex-1 sm:flex-initial"
          >
            <option value="all">All Therapists</option>
            {therapists.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Room filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-900/90 px-2.5 py-1.5 text-xs text-stone-300 focus:border-amber-500/60 focus:outline-none flex-1 sm:flex-initial"
          >
            <option value="all">All Suites</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Layout Toggle & Status Segmented control */}
        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 lg:pb-0">
          {/* Status Buttons */}
          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs overflow-x-auto">
            {['all', 'confirmed', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'in_progress'
                  ? 'Active'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs shrink-0">
            <button
              onClick={() => setViewLayout('timeline')}
              className={`p-1.5 rounded transition-colors ${
                viewLayout === 'timeline' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Timeline Agenda View"
            >
              <Columns className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded transition-colors ${
                viewLayout === 'list' ? 'bg-stone-800 text-stone-100' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Agenda Timeline or List */}
      {sortedAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800/80 bg-stone-900/20 p-8 sm:p-12 text-center">
          <CalendarIcon className="h-10 w-10 text-stone-600 mb-3" />
          <h3 className="font-serif text-lg font-medium text-stone-200">
            No Treatments Scheduled
          </h3>
          <p className="mt-1 text-xs text-stone-400 max-w-sm">
            There are no appointments matching your filters for this day. You can easily schedule a new session.
          </p>
          <button
            onClick={onOpenNewAppointment}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-500 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Book First Session</span>
          </button>
        </div>
      ) : viewLayout === 'timeline' ? (
        /* Timeline Agenda View */
        <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 overflow-hidden w-full max-w-full">
          <div className="divide-y divide-stone-800/60">
            {timeSlots.map((slot) => {
              const matchingApts = sortedAppointments.filter(
                (a) => a.startTime.startsWith(slot.substring(0, 2))
              );

              return (
                <div
                  key={slot}
                  className="flex flex-col sm:flex-row items-stretch min-h-[72px] sm:min-h-[80px] hover:bg-stone-900/40 transition-colors"
                >
                  {/* Time column */}
                  <div className="w-full sm:w-24 md:w-28 shrink-0 px-3 sm:px-4 py-2 sm:py-3 sm:border-r border-stone-800/60 text-xs font-mono tabular-nums text-stone-400 flex items-center justify-between sm:justify-start bg-stone-950/40 sm:bg-transparent">
                    <span className="font-semibold sm:font-normal">{slot}</span>
                    <span className="text-[10px] text-stone-500 sm:hidden">
                      {matchingApts.length > 0 ? `${matchingApts.length} booked` : 'Open'}
                    </span>
                  </div>

                  {/* Appointments Slot column */}
                  <div className="flex-1 p-2 sm:p-3 flex flex-wrap gap-2.5 sm:gap-3 items-center min-w-0">
                    {matchingApts.length === 0 ? (
                      <span className="text-[11px] text-stone-600 italic px-2 py-1">
                        Available for booking
                      </span>
                    ) : (
                      matchingApts.map((apt) => {
                        const badge = getStatusBadge(apt.status);
                        return (
                          <div
                            key={apt.id}
                            onClick={() => onSelectAppointment(apt)}
                            className="group relative w-full sm:w-auto sm:min-w-[260px] sm:flex-1 cursor-pointer rounded-xl border border-stone-800 bg-stone-950/80 p-3 hover:border-amber-500/50 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-serif text-sm font-semibold text-stone-100 group-hover:text-amber-300 transition-colors truncate">
                                  {apt.serviceName}
                                </h4>
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400 flex-wrap">
                                  <span className="font-medium text-stone-200">
                                    {apt.clientName}
                                  </span>
                                  <span aria-hidden="true" className="text-stone-600">·</span>
                                  <span className="font-mono tabular-nums text-stone-400">
                                    {apt.startTime}–{apt.endTime}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-serif text-sm font-medium text-amber-300 tabular-nums">
                                  {formatPrice(apt.price)}
                                </span>
                                <span className={`mt-1 block text-[10px] font-medium border px-1.5 py-0.5 rounded whitespace-nowrap ${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>

                            {/* Details row: Room & Therapist */}
                            <div className="mt-2 flex items-center justify-between border-t border-stone-800/80 pt-2 text-[11px] text-stone-400 gap-2">
                              <span className="flex items-center gap-1 truncate max-w-[130px] sm:max-w-[150px]">
                                <User className="h-3 w-3 text-stone-500 shrink-0" />
                                <span className="truncate">{apt.therapistName}</span>
                              </span>
                              <span className="flex items-center gap-1 truncate max-w-[130px] sm:max-w-[150px]">
                                <DoorOpen className="h-3 w-3 text-stone-500 shrink-0" />
                                <span className="truncate">{apt.roomName}</span>
                              </span>
                            </div>

                            {/* Allergy Alert Indicator */}
                            {apt.allergyNotice && (
                              <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                <span className="truncate">{apt.allergyNotice}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Compact List View */
        <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 overflow-x-auto w-full max-w-full">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Treatment</th>
                <th className="px-4 py-3 font-medium">Therapist</th>
                <th className="px-4 py-3 font-medium">Suite</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {sortedAppointments.map((apt) => {
                const badge = getStatusBadge(apt.status);
                return (
                  <tr
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className="hover:bg-stone-900/60 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono tabular-nums whitespace-nowrap text-stone-200">
                      {apt.startTime}–{apt.endTime}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-stone-100">
                      {apt.clientName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{apt.serviceName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-stone-400">
                      {apt.therapistName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-stone-400">
                      {apt.roomName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-serif font-medium text-amber-300 tabular-nums">
                      {formatPrice(apt.price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-mono text-[11px]">
                      <span className={apt.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-stone-400'}>
                        {apt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
