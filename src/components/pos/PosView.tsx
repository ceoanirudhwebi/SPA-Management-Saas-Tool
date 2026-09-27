import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Appointment, CartItem, PaymentMethod, SaleTransaction } from '../../types';
import {
  CreditCard,
  Plus,
  Minus,
  Trash2,
  Receipt,
  User,
  ShoppingBag,
  Sparkles,
  Percent,
  CheckCircle2,
  Search,
  History,
  Tag
} from 'lucide-react';
import { ReceiptModal } from '../modals/ReceiptModal';

interface PosViewProps {
  initialAppointment?: Appointment | null;
  onClearInitialAppointment?: () => void;
}

export const PosView: React.FC<PosViewProps> = ({
  initialAppointment,
  onClearInitialAppointment,
}) => {
  const {
    appointments,
    clients,
    inventory,
    services,
    settings,
    theme,
    completeCheckout,
    transactions,
    formatPrice,
  } = useSpa();

  const [activeTab, setActiveTab] = useState<'register' | 'history'>('register');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    initialAppointment || null
  );

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (initialAppointment) {
      return [
        {
          id: initialAppointment.serviceId,
          name: initialAppointment.serviceName,
          type: 'service',
          price: initialAppointment.price,
          quantity: 1,
        },
      ];
    }
    return [];
  });

  const [clientName, setClientName] = useState<string>(
    initialAppointment?.clientName || 'Walk-in Guest'
  );
  const [clientId, setClientId] = useState<string | undefined>(
    initialAppointment?.clientId
  );

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [productSearch, setProductSearch] = useState('');
  const [lastTransaction, setLastTransaction] = useState<SaleTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Unpaid appointments waiting for checkout
  const pendingAppointments = appointments.filter(
    (a) => a.paymentStatus === 'unpaid' && (a.status === 'in_progress' || a.status === 'completed' || a.status === 'confirmed')
  );

  const handleSelectAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setClientName(apt.clientName);
    setClientId(apt.clientId);
    setCartItems([
      {
        id: apt.serviceId,
        name: apt.serviceName,
        type: 'service',
        price: apt.price,
        quantity: 1,
      },
    ]);
  };

  const handleAddProduct = (item: (typeof inventory)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          type: 'product',
          price: item.retailPrice,
          quantity: 1,
        },
      ];
    });
  };

  const updateItemQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountVal = (subtotal * discountPercent) / 100;
  const taxable = Math.max(0, subtotal - discountVal);
  const taxVal = taxable * settings.taxRate;
  const total = taxable + taxVal + tipAmount;

  const handleTipPreset = (percentage: number) => {
    setTipAmount(Math.round(subtotal * (percentage / 100)));
  };

  const handleProcessSale = () => {
    if (cartItems.length === 0) return;

    const tx = completeCheckout({
      appointmentId: selectedAppointment?.id,
      clientId,
      clientName,
      items: cartItems,
      discountPercentage: discountPercent,
      tip: tipAmount,
      paymentMethod,
    });

    setLastTransaction(tx);
    setIsReceiptOpen(true);

    // Reset register
    setCartItems([]);
    setSelectedAppointment(null);
    setClientName('Walk-in Guest');
    setClientId(undefined);
    setDiscountPercent(0);
    setTipAmount(0);
    if (onClearInitialAppointment) onClearInitialAppointment();
  };

  // Filter inventory items for sale
  const filteredProducts = inventory.filter((item) =>
    item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Tabs: Register vs Sales History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div>
          <h3 className="font-serif text-xl font-semibold text-stone-100">
            Sanctuary Cashier &amp; POS
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Process guest checkouts, apply boutique retail items, tips, and instant thermal receipts
          </p>
        </div>

        <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900/80 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Ledger History ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'register' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Catalog & Pending Appointments) - 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            {/* Quick Unbilled Appointments Drawer */}
            {pendingAppointments.length > 0 && (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Treatments Awaiting Checkout ({pendingAppointments.length})
                </span>

                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {pendingAppointments.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => handleSelectAppointment(apt)}
                      className={`min-w-[200px] shrink-0 text-left rounded-xl p-3 border transition-all ${
                        selectedAppointment?.id === apt.id
                          ? 'border-amber-500 bg-amber-500/10 text-stone-100'
                          : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <p className="font-semibold text-xs text-stone-100 truncate">
                        {apt.clientName}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {apt.serviceName}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 font-mono">{apt.startTime}</span>
                        <span className="font-serif font-medium text-amber-300 tabular-nums">
                          {formatPrice(apt.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Boutique Retail Products Grid */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amber-400" />
                  <h4 className="font-serif text-base font-semibold text-stone-100">
                    Boutique Retail Add-ons
                  </h4>
                </div>

                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search retail products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-950 py-1.5 pl-8 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleAddProduct(prod)}
                    className="group cursor-pointer rounded-xl border border-stone-800/80 bg-stone-950/70 p-3 hover:border-amber-500/40 hover:bg-stone-900/60 transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-xs text-stone-200 group-hover:text-amber-300 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-stone-500 capitalize mt-0.5">
                        {prod.category.replace('_', ' ')} · {prod.stock} in stock
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-serif text-sm font-semibold text-amber-300 tabular-nums">
                        {formatPrice(prod.retailPrice)}
                      </span>
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-800 text-stone-200 group-hover:bg-amber-600 group-hover:text-stone-950 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Cart & Checkout Register) - 5 cols */}
          <div className="lg:col-span-5 rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-amber-400" />
                <h4 className="font-serif text-base font-semibold text-stone-100">
                  Current Order
                </h4>
              </div>

              {cartItems.length > 0 && (
                <button
                  onClick={() => setCartItems([])}
                  className="text-[11px] text-stone-500 hover:text-rose-400 transition-colors"
                >
                  Clear Order
                </button>
              )}
            </div>

            {/* Client Selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-stone-500" />
                Client Account
              </label>
              <select
                value={clientId || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  const c = clients.find((client) => client.id === id);
                  if (c) {
                    setClientId(c.id);
                    setClientName(c.name);
                  } else {
                    setClientId(undefined);
                    setClientName('Walk-in Guest');
                  }
                }}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="">Walk-in Guest</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tier})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  No items in cart. Select an appointment above or tap retail products to add.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-stone-800/80 bg-stone-950/80 p-2.5 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-stone-200 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateItemQty(item.id, -1)}
                          className="h-5 w-5 flex items-center justify-center rounded text-stone-400 hover:text-stone-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-mono tabular-nums text-xs text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItemQty(item.id, 1)}
                          className="h-5 w-5 flex items-center justify-center rounded text-stone-400 hover:text-stone-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-mono font-medium text-amber-300 tabular-nums w-16 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-600 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount & Tip Presets */}
            {cartItems.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-stone-800">
                {/* Discount */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-stone-500" />
                      Discount Preset
                    </span>
                    <span className="font-mono">{discountPercent}%</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-[11px]">
                    {[0, 5, 10, 15, 20].map((disc) => (
                      <button
                        key={disc}
                        onClick={() => setDiscountPercent(disc)}
                        className={`py-1 rounded border transition-colors ${
                          discountPercent === disc
                            ? 'bg-amber-600/20 text-amber-300 border-amber-500/40 font-semibold'
                            : 'border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {disc}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gratuity */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-stone-500" />
                      Staff Gratuity / Tip
                    </span>
                    <span className="font-mono tabular-nums text-stone-200">
                      {formatPrice(tipAmount)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[11px]">
                    {(settings.tipPresets || [0, 5, 10, 15]).map((tipPct) => (
                      <button
                        key={tipPct}
                        onClick={() => handleTipPreset(tipPct)}
                        className={`py-1 rounded border transition-colors ${
                          tipAmount === Math.round(subtotal * (tipPct / 100)) && tipPct !== 0
                            ? `${theme.lightBg} ${theme.accentText} ${theme.accentBorder} font-semibold`
                            : 'border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {tipPct === 0 ? 'None' : `${tipPct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <span className="text-[11px] font-medium text-stone-400 block mb-1">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(settings.paymentMethods?.filter((pm) => pm.enabled) || [
                      { id: '1', name: 'UPI / QR', code: 'upi_qr' },
                      { id: '2', name: 'Credit Card', code: 'credit_card' },
                      { id: '3', name: 'Cash', code: 'cash' },
                      { id: '4', name: 'Gift Card', code: 'gift_card' },
                    ]).map((pm) => (
                      <button
                        key={pm.code}
                        onClick={() => setPaymentMethod(pm.code)}
                        className={`py-1.5 px-2 rounded-lg border text-left capitalize transition-colors text-[11px] ${
                          paymentMethod === pm.code
                            ? `${theme.lightBg} ${theme.accentText} ${theme.accentBorder} font-medium`
                            : 'border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {pm.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Totals */}
                <div className="space-y-1.5 text-xs text-stone-400 pt-2 border-t border-stone-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-stone-200">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {discountVal > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono tabular-nums">
                        -{formatPrice(discountVal)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{settings.taxName || 'GST / Tax'} ({(settings.taxRate * 100).toFixed(2)}%)</span>
                    <span className="font-mono tabular-nums text-stone-200">
                      {formatPrice(taxVal)}
                    </span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-stone-300">
                      <span>Tip</span>
                      <span className="font-mono tabular-nums">
                        {formatPrice(tipAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-stone-800 text-stone-100 font-serif text-lg font-bold">
                    <span>Grand Total</span>
                    <span className={`font-mono ${theme.accentText} tabular-nums`}>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Finalize Button */}
                <button
                  onClick={handleProcessSale}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} py-3 text-xs font-bold active:scale-[0.99] transition-all shadow-md mt-3`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Charge {formatPrice(total)} &amp; Print Receipt</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Sales Ledger History */
        <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-800 bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-medium">Receipt #</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                <th className="px-4 py-3 font-medium text-right">Tip</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono tabular-nums text-amber-300">
                    {tx.receiptNumber}
                  </td>
                  <td className="px-4 py-3 font-mono text-stone-400">{tx.date}</td>
                  <td className="px-4 py-3 font-medium text-stone-100">{tx.clientName}</td>
                  <td className="px-4 py-3 text-stone-400">
                    {tx.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="px-4 py-3 capitalize text-stone-400">
                    {tx.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    {formatPrice(tx.subtotal)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-400">
                    {formatPrice(tx.tip)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-amber-300 tabular-nums">
                    {formatPrice(tx.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setLastTransaction(tx);
                        setIsReceiptOpen(true);
                      }}
                      className="px-2 py-1 text-[11px] rounded border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        transaction={lastTransaction}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
