import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Therapist } from '../../types';
import {
  UserCheck,
  Star,
  Clock,
  Phone,
  Mail,
  Plus,
  DollarSign,
  Calendar,
  Award,
  Edit2
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { therapists, addTherapist, updateTherapist, toggleTherapistStatus, formatPrice, theme } = useSpa();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(4.9);
  const [commissionRate, setCommissionRate] = useState(30);
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('17:00');

  const openAddModal = () => {
    setEditingTherapist(null);
    setName('');
    setTitle('Licensed Wellness Therapist');
    setEmail('');
    setPhone('');
    setRating(4.9);
    setCommissionRate(30);
    setSpecialtiesStr('Deep Tissue, Aromatherapy, Hot Stone');
    setStartHour('09:00');
    setEndHour('17:00');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Therapist) => {
    setEditingTherapist(t);
    setName(t.name);
    setTitle(t.title);
    setEmail(t.email);
    setPhone(t.phone);
    setRating(t.rating);
    setCommissionRate(Math.round(t.commissionRate * 100));
    setSpecialtiesStr(t.specialties.join(', '));
    setStartHour(t.workingHours.start);
    setEndHour(t.workingHours.end);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specialties = specialtiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingTherapist) {
      updateTherapist(editingTherapist.id, {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        phone: phone.trim(),
        rating: Number(rating),
        commissionRate: Number(commissionRate) / 100,
        specialties,
        workingHours: { start: startHour, end: endHour },
      });
    } else {
      addTherapist({
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        phone: phone.trim(),
        rating: Number(rating),
        commissionRate: Number(commissionRate) / 100,
        specialties,
        workingHours: { start: startHour, end: endHour },
        offDays: ['Monday'],
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-100">
            Therapists & Staff Directory
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage practitioners, specialty accreditations, commission payouts, and schedules
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-3.5 py-2 text-xs font-semibold shadow-sm self-start sm:self-auto shrink-0 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {therapists.map((therapist) => {
          return (
            <div
              key={therapist.id}
              className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 flex flex-col justify-between hover:border-amber-500/30 transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-serif font-bold text-base">
                      {therapist.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-semibold text-stone-100">
                          {therapist.name}
                        </h4>
                        <span className="flex items-center text-xs font-medium text-amber-400 font-mono">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {therapist.rating.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">{therapist.title}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(therapist)}
                    className="p-1.5 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="mt-3.5 space-y-1 text-xs text-stone-400">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                    <span>{therapist.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                    <span className="truncate">{therapist.email}</span>
                  </p>
                </div>

                {/* Working hours & specialties */}
                <div className="mt-3 rounded-xl border border-stone-800/80 bg-stone-950/60 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      Hours
                    </span>
                    <span className="font-mono tabular-nums">
                      {therapist.workingHours.start} – {therapist.workingHours.end}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-800/60">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                      Specialties
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {therapist.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-stone-300 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics & Status */}
              <div className="mt-4 pt-3 border-t border-stone-800/80">
                <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-400 pb-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Treatments</span>
                    <span className="font-semibold text-stone-200 tabular-nums">
                      {therapist.appointmentsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Rev. Generated</span>
                    <span className="font-semibold text-amber-300 tabular-nums">
                      {formatPrice(therapist.revenueGenerated)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Comm. Rate</span>
                    <span className="font-semibold text-emerald-400 tabular-nums">
                      {Math.round(therapist.commissionRate * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleTherapistStatus(therapist.id)}
                    className={`text-xs font-medium transition-colors ${
                      therapist.isActive ? 'text-emerald-400' : 'text-stone-500'
                    }`}
                  >
                    ● {therapist.isActive ? 'On Duty (Accepting Bookings)' : 'Off Duty / On Leave'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              {editingTherapist ? 'Edit Staff Profile' : 'Add Therapist'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Neuromuscular Bodyworker"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Commission %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Shift Start</label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Shift End</label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={specialtiesStr}
                  onChange={(e) => setSpecialtiesStr(e.target.value)}
                  placeholder="e.g. Balinese, Shiatsu, Facial Rejuvenation"
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-5 py-2 font-medium shadow-sm transition-all`}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
