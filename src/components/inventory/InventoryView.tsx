import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { InventoryItem } from '../../types';
import {
  Package,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  Flame,
  DollarSign,
  Tag,
  Edit2,
  Trash2
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    formatPrice,
    settings,
    theme,
  } = useSpa();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('oils');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [unitCost, setUnitCost] = useState(15);
  const [retailPrice, setRetailPrice] = useState(45);
  const [supplier, setSupplier] = useState('');

  const categories = [
    { id: 'all', label: 'All Inventory' },
    { id: 'oils', label: 'Botanical Oils' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'candles_aroma', label: 'Aromatics & Candles' },
    { id: 'scrubs', label: 'Body Scrubs' },
    { id: 'linen_amenities', label: 'Linens & Amenities' },
  ];

  const filteredItems = inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Inventory KPI calculations
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventory.filter((item) => item.stock <= item.minStock).length;
  const retailValuation = inventory.reduce((sum, item) => sum + item.retailPrice * item.stock, 0);
  const costValuation = inventory.reduce((sum, item) => sum + item.unitCost * item.stock, 0);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('oils');
    setSku(`SKU-${Date.now().toString().slice(-4)}`);
    setStock(15);
    setMinStock(5);
    setUnitCost(18);
    setRetailPrice(52);
    setSupplier('Aura Artisan Supplies');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setSku(item.sku);
    setStock(item.stock);
    setMinStock(item.minStock);
    setUnitCost(item.unitCost);
    setRetailPrice(item.retailPrice);
    setSupplier(item.supplier);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        name: name.trim(),
        category,
        sku: sku.trim(),
        stock: Number(stock),
        minStock: Number(minStock),
        unitCost: Number(unitCost),
        retailPrice: Number(retailPrice),
        supplier: supplier.trim(),
      });
    } else {
      addInventoryItem({
        name: name.trim(),
        category,
        sku: sku.trim(),
        stock: Number(stock),
        minStock: Number(minStock),
        unitCost: Number(unitCost),
        retailPrice: Number(retailPrice),
        supplier: supplier.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Stock Units
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-stone-100 tabular-nums">
            {totalStockUnits}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">{inventory.length} distinct SKUs</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Reorder Alerts
          </span>
          <span className={`mt-1 font-serif text-2xl font-bold tabular-nums ${lowStockCount > 0 ? 'text-rose-400' : 'text-stone-300'}`}>
            {lowStockCount}
          </span>
          <span className="mt-0.5 text-[10px] text-rose-500/80 block">At or below reorder minimum</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Retail Valuation
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-amber-300 tabular-nums">
            {formatPrice(retailValuation)}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">Inventory retail potential</span>
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Asset Cost Basis
          </span>
          <span className="mt-1 font-serif text-2xl font-bold text-stone-100 tabular-nums">
            {formatPrice(costValuation)}
          </span>
          <span className="mt-0.5 text-[10px] text-stone-400 block">Total wholesale investment</span>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search product, SKU or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900/90 py-1.5 pl-9 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
            />
          </div>

          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={openAddModal}
          className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-3.5 py-2 text-xs font-semibold shadow-sm self-start sm:self-auto shrink-0 transition-all`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3 font-medium">SKU / Code</th>
              <th className="px-4 py-3 font-medium">Product Name &amp; Category</th>
              <th className="px-4 py-3 font-medium">Supplier</th>
              <th className="px-4 py-3 font-medium text-center">Stock Level</th>
              <th className="px-4 py-3 font-medium text-right">Wholesale</th>
              <th className="px-4 py-3 font-medium text-right">Retail</th>
              <th className="px-4 py-3 font-medium text-right">Margin</th>
              <th className="px-4 py-3 font-medium text-center">Stock Adjustment</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 text-stone-300">
            {filteredItems.map((item) => {
              const isLowStock = item.stock <= item.minStock;
              const margin = Math.round(((item.retailPrice - item.unitCost) / item.retailPrice) * 100);

              return (
                <tr key={item.id} className="hover:bg-stone-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono tabular-nums text-stone-400">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-100">{item.name}</p>
                    <p className="text-[11px] text-stone-500 capitalize">{item.category.replace('_', ' ')}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-400">{item.supplier}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-mono font-bold tabular-nums text-stone-100">
                        {item.stock}
                      </span>
                      {isLowStock && (
                        <span className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-900/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low (Min: {item.minStock})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-400">
                    {formatPrice(item.unitCost)}
                  </td>
                  <td className="px-4 py-3 text-right font-serif font-medium text-amber-300 tabular-nums">
                    {formatPrice(item.retailPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-400">
                    {margin}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => adjustStock(item.id, -1)}
                        className="h-6 w-6 rounded border border-stone-800 bg-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-100 hover:border-stone-700"
                        title="Reduce stock"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, 1)}
                        className="h-6 w-6 rounded border border-stone-800 bg-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-100 hover:border-stone-700"
                        title="Add 1 unit"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, 10)}
                        className="px-1.5 py-0.5 rounded border border-stone-800 bg-stone-900 text-[10px] font-mono text-stone-400 hover:text-stone-100"
                        title="Restock batch (+10)"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 rounded text-stone-400 hover:text-stone-200"
                        title="Edit product"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product "${item.name}"?`)) {
                            deleteInventoryItem(item.id);
                          }
                        }}
                        className="p-1 rounded text-stone-400 hover:text-rose-400"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Inventory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              {editingItem ? 'Edit Boutique Item' : 'New Inventory Item'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-300">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Jasmine & Argan Conditioning Oil"
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
                    onChange={(e) => setCategory(e.target.value as InventoryItem['category'])}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="oils">Botanical Oils</option>
                    <option value="skincare">Skincare</option>
                    <option value="candles_aroma">Aromatics & Candles</option>
                    <option value="scrubs">Body Scrubs</option>
                    <option value="linen_amenities">Linens & Amenities</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">In Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Min Alert</label>
                  <input
                    type="number"
                    min="1"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Unit Cost ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Retail ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Supplier / Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Provence Herbals Ltd"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
