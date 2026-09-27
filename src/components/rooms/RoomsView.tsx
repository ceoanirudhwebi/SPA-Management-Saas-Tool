import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { TreatmentRoom, RoomStatus, RoomType } from '../../types';
import {
  DoorOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Plus,
  RefreshCw,
  Bath,
  Layers,
  Wrench
} from 'lucide-react';

export const RoomsView: React.FC = () => {
  const { rooms, updateRoomStatus, addRoom, appointments, theme } = useSpa();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>('massage');
  const [newCapacity, setNewCapacity] = useState(1);

  const getStatusVisuals = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available & Ready',
          badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          indicator: 'bg-emerald-400',
        };
      case 'occupied':
        return {
          label: 'Session In Progress',
          badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          indicator: 'bg-amber-400 animate-pulse',
        };
      case 'cleaning':
        return {
          label: 'Needs Sanitizing',
          badge: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
          indicator: 'bg-sky-400',
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          badge: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          indicator: 'bg-rose-400',
        };
      default:
        return {
          label: status,
          badge: 'text-stone-400 bg-stone-500/10 border-stone-500/30',
          indicator: 'bg-stone-400',
        };
    }
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    addRoom({
      name: newRoomName.trim(),
      type: newRoomType,
      capacity: newCapacity,
      status: 'available',
    });

    setNewRoomName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-100">
            Sanctuary Suites & Treatment Chambers
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time suite allocation, turnover tracking, and hygiene sanitization logs
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-3.5 py-2 text-xs font-semibold shadow-sm self-start sm:self-auto shrink-0 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Suite / Room</span>
        </button>
      </div>

      {/* Room Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const visual = getStatusVisuals(room.status);
          const activeApt = appointments.find((a) => a.id === room.currentAppointmentId);

          return (
            <div
              key={room.id}
              className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 flex flex-col justify-between hover:border-stone-700 transition-all"
            >
              <div>
                {/* Title & Status Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${visual.indicator}`} />
                    <h4 className="font-serif text-base font-semibold text-stone-100">
                      {room.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${visual.badge}`}>
                    {visual.label}
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-400 capitalize flex items-center gap-2">
                  <span>Type: {room.type.replace('_', ' ')}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>Capacity: {room.capacity} {room.capacity > 1 ? 'guests' : 'guest'}</span>
                </p>

                {/* Active Session Info */}
                {room.status === 'occupied' && (
                  <div className="mt-4 rounded-xl border border-amber-900/40 bg-amber-950/20 p-3 text-xs text-amber-200">
                    <span className="text-[10px] uppercase font-semibold text-amber-400 block mb-1">
                      Current In-Session Guest
                    </span>
                    <p className="font-medium text-stone-100">{activeApt?.clientName || 'Walk-in Client'}</p>
                    <p className="text-stone-300 text-[11px] mt-0.5 flex items-center justify-between">
                      <span>{activeApt?.serviceName || 'Treatment Ritual'}</span>
                      <span className="font-mono tabular-nums text-amber-300">
                        {activeApt?.startTime}–{activeApt?.endTime}
                      </span>
                    </p>
                    {room.currentTherapistName && (
                      <p className="mt-1 text-[11px] text-stone-400 flex items-center gap-1">
                        <User className="h-3 w-3 text-amber-400" />
                        <span>Therapist: {room.currentTherapistName}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Cleaning Notice */}
                {room.status === 'cleaning' && (
                  <div className="mt-4 rounded-xl border border-sky-900/40 bg-sky-950/20 p-3 text-xs text-sky-200">
                    <span className="text-[10px] uppercase font-semibold text-sky-400 block mb-1">
                      Sanitization Protocol Active
                    </span>
                    <p className="text-[11px] text-stone-300">
                      Awaiting fresh organic linens, essential oil misting, and surface sterilization.
                    </p>
                    <button
                      onClick={() => updateRoomStatus(room.id, 'available')}
                      className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-sky-600/20 border border-sky-500/40 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-600/30 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Sanitization Done (Mark Available)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status Change Segmented Controls */}
              <div className="mt-5 pt-3 border-t border-stone-800/80">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1.5">
                  Change Suite Status
                </span>
                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  <button
                    onClick={() => updateRoomStatus(room.id, 'available')}
                    className={`py-1 rounded border transition-colors ${
                      room.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'occupied')}
                    className={`py-1 rounded border transition-colors ${
                      room.status === 'occupied'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'cleaning')}
                    className={`py-1 rounded border transition-colors ${
                      room.status === 'cleaning'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => updateRoomStatus(room.id, 'maintenance')}
                    className={`py-1 rounded border transition-colors ${
                      room.status === 'maintenance'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                        : 'border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Repair
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Add New Sanctuary Suite
            </h3>

            <form onSubmit={handleAddRoom} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-300">Suite Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zen Cedar Spa Pavilion"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Room Specialization</label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as RoomType)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="massage">Massage & Bodywork Suite</option>
                  <option value="facial">Medical & Aesthetic Facial Room</option>
                  <option value="hydro">Hydrotherapy & Mineral Onsen</option>
                  <option value="couple_suite">Royal Couple Sanctuary</option>
                  <option value="relaxation">Nails & Relaxation Lounge</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Guest Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-5 py-2 font-medium shadow-sm transition-all`}
                >
                  Create Suite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
