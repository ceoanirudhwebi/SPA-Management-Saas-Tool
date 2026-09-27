import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Client, ClientTier } from '../../types';
import { X, User, Phone, Mail, AlertCircle, Heart } from 'lucide-react';

interface ClientModalProps {
  client?: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  const { addClient, updateClient, theme } = useSpa();

  const [name, setName] = useState(client?.name || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [tier, setTier] = useState<ClientTier>(client?.tier || 'New');
  const [skinType, setSkinType] = useState(client?.skinType || 'Normal');
  const [allergies, setAllergies] = useState(client?.allergies || 'None');
  const [notes, setNotes] = useState(client?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (client) {
      updateClient(client.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        tier,
        skinType: skinType.trim(),
        allergies: allergies.trim(),
        notes: notes.trim(),
      });
    } else {
      addClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        tier,
        skinType: skinType.trim(),
        allergies: allergies.trim(),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 bg-stone-950/60">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-100">
              {client ? 'Edit Client Profile' : 'New Client Registration'}
            </h2>
            <p className="text-xs text-stone-400">Manage client CRM, preferences & medical flags</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-stone-300 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-stone-400" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Evelyn De Laurentis"
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-stone-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-stone-300">Membership Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as ClientTier)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="New">New Client</option>
                <option value="Regular">Regular Member</option>
                <option value="VIP">VIP Executive Tier</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-300 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-stone-400" />
                Skin Type / Condition
              </label>
              <input
                type="text"
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                placeholder="e.g. Sensitive / Dry / Mature"
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              Allergies, Medical Cautions & Contraindications
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Sensitive to lavender, nut oils; avoids high heat"
              className="w-full rounded-lg border border-amber-900/50 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-stone-300">Personal Preferences & Therapist Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves green tea on arrival, prefers deep pressure, dislikes loud music"
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

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
              {client ? 'Save Profile Changes' : 'Create Client Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
