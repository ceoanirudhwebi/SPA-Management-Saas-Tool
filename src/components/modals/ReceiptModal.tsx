import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { SaleTransaction } from '../../types';
import { X, Printer, CheckCircle, Sparkles } from 'lucide-react';

interface ReceiptModalProps {
  transaction: SaleTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { settings, formatPrice } = useSpa();

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-3.5 bg-stone-950/60 print:hidden">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Transaction Finalized</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-200 hover:bg-stone-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Luxury Receipt Body */}
        <div id="printable-receipt" className="p-6 md:p-8 space-y-5 bg-stone-950 text-stone-100 overflow-y-auto font-sans">
          {/* Brand & Spa Header */}
          <div className="text-center space-y-1 pb-4 border-b border-stone-800">
            <h2 className="font-serif text-2xl font-semibold tracking-wide text-amber-200">
              {settings.spaName}
            </h2>
            <p className="text-xs text-stone-400">{settings.tagline}</p>
            <p className="text-[11px] text-stone-500">{settings.address}</p>
            <p className="text-[11px] text-stone-500">
              {settings.phone} · {settings.email}
            </p>
          </div>

          {/* Receipt Metadata */}
          <div className="flex justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
            <div>
              <p className="text-stone-500 text-[10px] uppercase">Receipt No.</p>
              <p className="font-mono font-medium text-stone-200 text-xs">{transaction.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-[10px] uppercase">Date & Time</p>
              <p className="font-mono text-stone-200 text-xs">{transaction.date}</p>
            </div>
          </div>

          {/* Client & Payment Info */}
          <div className="flex justify-between text-xs border-b border-stone-800 pb-3">
            <div>
              <p className="text-stone-500 text-[10px] uppercase">Guest</p>
              <p className="font-medium text-stone-200">{transaction.clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-500 text-[10px] uppercase">Payment Method</p>
              <p className="font-medium text-amber-300 capitalize">
                {transaction.paymentMethod === 'upi_qr'
                  ? 'UPI / QR Payment'
                  : transaction.paymentMethod.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div className="space-y-2 border-b border-stone-800 pb-4">
            <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider">
              Itemized Charges
            </p>
            <div className="space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-stone-200">{item.name}</span>
                    <span className="text-[11px] text-stone-500 block">
                      {item.type === 'service' ? 'Treatment Session' : 'Boutique Product'} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono text-stone-200 tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation summary */}
          <div className="space-y-1.5 text-xs text-stone-400 border-b border-stone-800 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-stone-200">
                {formatPrice(transaction.subtotal)}
              </span>
            </div>

            {transaction.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({transaction.discountPercentage}%)</span>
                <span className="font-mono tabular-nums">
                  -{formatPrice(transaction.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Sales & Service Tax ({(settings.taxRate * 100).toFixed(2)}%)</span>
              <span className="font-mono tabular-nums text-stone-200">
                {formatPrice(transaction.tax)}
              </span>
            </div>

            {transaction.tip > 0 && (
              <div className="flex justify-between text-stone-300">
                <span>Therapist Gratuity</span>
                <span className="font-mono tabular-nums">
                  {formatPrice(transaction.tip)}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-stone-800 font-serif text-lg font-bold text-amber-200">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums text-base">
                {formatPrice(transaction.total)}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-stone-500 space-y-1">
            <p className="font-serif italic text-stone-400">
              May the serenity of this sanctuary follow you today.
            </p>
            <p>Thank you for choosing {settings.spaName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
