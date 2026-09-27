import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Client, ClientTier } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Award,
  DollarSign,
  Edit2,
  Trash2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ClientModal } from '../modals/ClientModal';

interface ClientsViewProps {
  onBookForClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onBookForClient }) => {
  const { clients, deleteClient, formatPrice, theme } = useSpa();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesTier = tierFilter === 'all' || client.tier === tierFilter;
    const matchesSearch =
      !searchQuery ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  // Calculate CRM KPIs
  const totalRevenueFromClients = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const vipCount = clients.filter((c) => c.tier === 'VIP').length;
  const avgVisits = clients.length ? (clients.reduce((acc, c) => acc + c.visitsCount, 0) / clients.length).toFixed(1) : '0';

  const handleEdit = (c: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(c);
    setIsModalOpen(true);
  };

  const handleDelete = (c: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove client ${c.name}?`)) {
      deleteClient(c.id);
      if (selectedClient?.id === c.id) setSelectedClient(null);
    }
  };

  const getTierColor = (tier: ClientTier) => {
    switch (tier) {
      case 'VIP':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Regular':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      default:
        return 'text-stone-400 bg-stone-500/10 border-stone-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top CRM KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Total Client Base
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-stone-100 tabular-nums">
            {clients.length}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">Registered profiles</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            VIP Members
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-amber-400 tabular-nums">
            {vipCount}
          </span>
          <span className="mt-0.5 text-[10px] text-amber-500/80 block">Priority clientele</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Client Lifetime Spend
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-stone-100 tabular-nums">
            {formatPrice(totalRevenueFromClients)}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">Cumulative revenue</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Avg. Visits / Client
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-stone-100 tabular-nums">
            {avgVisits}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">Repeat loyalty rate</span>
        </div>
      </div>

      {/* Filter and Action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search by client name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900/90 py-1.5 pl-9 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
            />
          </div>

          {/* Tier segmented buttons */}
          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs">
            {['all', 'VIP', 'Regular', 'New'].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  tierFilter === t
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t === 'all' ? 'All Clients' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Add Client Button */}
        <button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-4 py-2 text-xs font-semibold shadow-sm shrink-0 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>New Client</span>
        </button>
      </div>

      {/* Client List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="group cursor-pointer rounded-2xl border border-stone-800/90 bg-stone-900/40 p-4 hover:border-amber-500/40 hover:bg-stone-900/70 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-stone-300 font-serif font-semibold border border-stone-700/60">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
                        {client.name}
                      </h4>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded border ${getTierColor(client.tier)}`}>
                        {client.tier}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleEdit(client, e)}
                      className="p-1.5 rounded text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(client, e)}
                      className="p-1.5 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact metadata */}
                <div className="mt-3.5 space-y-1 text-xs text-stone-400">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                    <span>{client.phone}</span>
                  </p>
                  {client.email && (
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                  )}
                </div>

                {/* Medical / Allergies banner */}
                {client.allergies && client.allergies !== 'None' && (
                  <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-900/40 bg-amber-950/20 px-2.5 py-1.5 text-[11px] text-amber-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                    <span className="line-clamp-2">{client.allergies}</span>
                  </div>
                )}
              </div>

              {/* Bottom stats and action */}
              <div className="mt-4 pt-3 border-t border-stone-800/80">
                <div className="grid grid-cols-3 gap-1 text-[11px] text-stone-400 pb-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Visits</span>
                    <span className="font-semibold text-stone-200 tabular-nums">
                      {client.visitsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Total Spend</span>
                    <span className="font-semibold text-amber-300 tabular-nums">
                      {formatPrice(client.totalSpent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Loyalty Pts</span>
                    <span className="font-semibold text-emerald-400 tabular-nums">
                      {client.loyaltyPoints}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookForClient(client);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / New Modal */}
      <ClientModal
        client={editingClient}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
      />
    </div>
  );
};
