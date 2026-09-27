import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { X, Calendar, Clock, User, Sparkles, DoorOpen, AlertCircle } from 'lucide-react';
import { getOffsetDate } from '../../data/mockData';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  initialTime = '10:00',
}) => {
  const { clients, services, therapists, rooms, addAppointment, selectedDate, formatPrice, showToast, theme } = useSpa();

  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || '');
  const [therapistId, setTherapistId] = useState<string>(therapists[0]?.id || '');
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id || '');
  const [date, setDate] = useState<string>(initialDate || selectedDate || getOffsetDate(0));
  const [startTime, setStartTime] = useState<string>(initialTime);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === serviceId) || services[0];
  const selectedTherapist = therapists.find((t) => t.id === therapistId) || therapists[0];
  const selectedRoom = rooms.find((r) => r.id === roomId) || rooms[0];
  const existingClient = clients.find((c) => c.id === clientId);

  // Calculate End Time based on duration
  const calculateEndTime = (start: string, durationMinutes: number) => {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const endTime = calculateEndTime(startTime, selectedService?.duration || 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalClientName = '';
    let finalClientPhone = '';
    let finalClientEmail = '';
    let finalClientId = clientId;

    if (isNewClient) {
      if (!newClientName.trim()) {
        showToast('Please enter the client name', 'warning');
        return;
      }
      finalClientName = newClientName.trim();
      finalClientPhone = newClientPhone.trim() || 'Walk-in';
      finalClientEmail = newClientEmail.trim() || '';
      finalClientId = `cl-temp-${Date.now()}`;
    } else {
      if (!existingClient) {
        showToast('Please select a client', 'warning');
        return;
      }
      finalClientName = existingClient.name;
      finalClientPhone = existingClient.phone;
      finalClientEmail = existingClient.email;
    }

    addAppointment({
      clientId: finalClientId,
      clientName: finalClientName,
      clientPhone: finalClientPhone,
      clientEmail: finalClientEmail,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      therapistId: selectedTherapist.id,
      therapistName: selectedTherapist.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      date,
      startTime,
      duration: selectedService.duration,
      endTime,
      price: selectedService.price,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      notes: notes.trim(),
      allergyNotice: existingClient?.allergies && existingClient.allergies !== 'None' ? existingClient.allergies : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 bg-stone-950/60">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-100">
              Schedule Treatment
            </h2>
            <p className="text-xs text-stone-400">Book client session, assign therapist and suite</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-stone-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-400" />
                Client Profile
              </label>
              <button
                type="button"
                onClick={() => setIsNewClient(!isNewClient)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                {isNewClient ? 'Select existing client' : '+ New / Walk-in client'}
              </button>
            </div>

            {isNewClient ? (
              <div className="space-y-2 rounded-xl border border-stone-800 bg-stone-950/60 p-3">
                <input
                  type="text"
                  placeholder="Client Full Name *"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tier}) · {c.phone}
                    </option>
                  ))}
                </select>

                {existingClient?.allergies && existingClient.allergies !== 'None' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/30 border border-amber-900/40 rounded-md px-2 py-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>Client notice: {existingClient.allergies}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div className="space-y-1.5">
            <label className="font-medium text-stone-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Treatment / Ritual
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
            >
              {services
                .filter((s) => s.isActive)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.duration} min · {formatPrice(s.price)}
                  </option>
                ))}
            </select>
          </div>

          {/* Therapist & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-stone-300">Therapist</label>
              <select
                value={therapistId}
                onChange={(e) => setTherapistId(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                {therapists
                  .filter((t) => t.isActive)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (★ {t.rating})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1">
                <DoorOpen className="h-3.5 w-3.5 text-stone-400" />
                Treatment Room
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} [{r.status}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                Start Time (Duration: {selectedService?.duration}m)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  required
                />
                <span className="text-stone-500 whitespace-nowrap">until {endTime}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-medium text-stone-300">Appointment Notes / Special Requests</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on neck tension, organic floral oils, quiet room"
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Price summary */}
          <div className="flex items-center justify-between rounded-xl bg-stone-950 p-3 border border-stone-800">
            <span className="text-stone-400">Treatment Fee</span>
            <span className="font-serif text-base font-semibold text-amber-300 tabular-nums">
              {formatPrice(selectedService?.price || 0)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-5 py-2 font-medium shadow-sm transition-all`}
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
