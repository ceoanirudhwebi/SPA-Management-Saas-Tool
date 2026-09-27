import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Service, ServiceCategory, RoomType } from '../../types';
import {
  Sparkles,
  Clock,
  Plus,
  DollarSign,
  Percent,
  DoorOpen,
  Edit2,
  Trash2,
  Check,
  Search
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, addService, updateService, deleteService, formatPrice, settings, theme } = useSpa();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('massage');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(140);
  const [description, setDescription] = useState('');
  const [commissionRate, setCommissionRate] = useState(30);
  const [requiredRoom, setRequiredRoom] = useState<RoomType>('massage');

  const categories = [
    { id: 'all', label: 'All Rituals' },
    ...(settings.categories || []).map((c) => ({ id: c.id, label: c.name })),
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('massage');
    setDuration(60);
    setPrice(140);
    setDescription('');
    setCommissionRate(30);
    setRequiredRoom('massage');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setDuration(s.duration);
    setPrice(s.price);
    setDescription(s.description);
    setCommissionRate(Math.round(s.therapistCommissionRate * 100));
    setRequiredRoom(s.requiredRoomType);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        category,
        duration: Number(duration),
        price: Number(price),
        description: description.trim(),
        therapistCommissionRate: Number(commissionRate) / 100,
        requiredRoomType: requiredRoom,
      });
    } else {
      addService({
        name: name.trim(),
        category,
        duration: Number(duration),
        price: Number(price),
        description: description.trim(),
        therapistCommissionRate: Number(commissionRate) / 100,
        requiredRoomType: requiredRoom,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-100">
            Rituals & Treatment Menu
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure spa experiences, pricing tiers, commission payouts, and chamber requirements
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-3.5 py-2 text-xs font-semibold shadow-sm self-start sm:self-auto shrink-0 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>New Treatment Ritual</span>
        </button>
      </div>

      {/* Filter and Category segmented buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-800 bg-stone-900/90 py-1.5 pl-9 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          return (
            <div
              key={service.id}
              className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 flex flex-col justify-between hover:border-amber-500/30 hover:bg-stone-900/60 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-amber-500/80 tracking-wider">
                      {service.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-stone-100 mt-0.5">
                      {service.name}
                    </h4>
                  </div>
                  <span className="font-serif text-lg font-semibold text-amber-300 tabular-nums">
                    {formatPrice(service.price)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-800/80">
                <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-400 pb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-stone-500" />
                    <span className="font-mono tabular-nums">{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5 text-stone-500" />
                    <span className="font-mono tabular-nums">
                      {Math.round(service.therapistCommissionRate * 100)}% comm.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <DoorOpen className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                    <span className="truncate capitalize">{service.requiredRoomType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() =>
                      updateService(service.id, { isActive: !service.isActive })
                    }
                    className={`text-[11px] font-medium transition-colors ${
                      service.isActive ? 'text-emerald-400' : 'text-stone-500'
                    }`}
                  >
                    ● {service.isActive ? 'Active on Menu' : 'Archived'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete service "${service.name}"?`)) {
                          deleteService(service.id);
                        }
                      }}
                      className="p-1.5 rounded text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              {editingService ? 'Edit Treatment Ritual' : 'Create Treatment Ritual'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-300">Treatment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Tibetan Singing Bowl Massage"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  >
                    {(settings.categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Required Chamber Type</label>
                  <select
                    value={requiredRoom}
                    onChange={(e) => setRequiredRoom(e.target.value as RoomType)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="massage">Massage Suite</option>
                    <option value="facial">Facial Room</option>
                    <option value="hydro">Hydro Oasis</option>
                    <option value="couple_suite">Couple Suite</option>
                    <option value="relaxation">Relaxation Lounge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Duration (min)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Price ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Therapist Comm. %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline the sensory ingredients, benefits, and techniques used..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
