import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { ThemeAccent, BrandIcon } from '../../types';
import { THEME_PALETTES, renderBrandIcon } from '../../utils/theme';
import {
  Palette,
  Building,
  DollarSign,
  LayoutDashboard,
  Layers,
  CreditCard,
  Award,
  Clock,
  Database,
  Save,
  Plus,
  Trash2,
  Check,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Smartphone,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    theme,
    updateSettings,
    resetToDemoData,
    exportDatabaseJson,
    importDatabaseJson,
    addCategory,
    deleteCategory,
    addPaymentMethod,
    togglePaymentMethod,
    deletePaymentMethod,
    formatPrice,
  } = useSpa();

  const [activeTab, setActiveTab] = useState<
    'brand' | 'profile' | 'currency' | 'dashboard' | 'categories' | 'payments' | 'loyalty' | 'schedule' | 'backup'
  >('brand');

  // Form states for general settings
  const [spaName, setSpaName] = useState(settings.spaName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [taxRegNumber, setTaxRegNumber] = useState(settings.taxRegistrationNumber || '');
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooterNote || '');

  // Theme states
  const [themeAccent, setThemeAccent] = useState<ThemeAccent>(settings.themeAccent || 'amber');
  const [brandIcon, setBrandIcon] = useState<BrandIcon>(settings.brandIcon || 'sparkles');
  const [fontDisplay, setFontDisplay] = useState<'serif' | 'sans'>(settings.fontDisplay || 'serif');

  // Currency & Taxes
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '₹');
  const [currencyCode, setCurrencyCode] = useState(settings.currencyCode || 'INR');
  const [currencyPosition, setCurrencyPosition] = useState<'prefix' | 'suffix'>(settings.currencyPosition || 'prefix');
  const [taxName, setTaxName] = useState(settings.taxName || 'GST');
  const [taxRatePercent, setTaxRatePercent] = useState(settings.taxRate * 100);

  // Operations
  const [openingTime, setOpeningTime] = useState(settings.openingTime || '08:00');
  const [closingTime, setClosingTime] = useState(settings.closingTime || '20:00');
  const [slotDuration, setSlotDuration] = useState(settings.slotDurationMinutes || 60);

  // Loyalty rules
  const [loyaltySpendPerPoint, setLoyaltySpendPerPoint] = useState(settings.loyaltySpendPerPoint || 100);
  const [vipSpendThreshold, setVipSpendThreshold] = useState(settings.vipSpendThreshold || 50000);

  // Add custom category modal/input
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Add custom payment method
  const [newPmName, setNewPmName] = useState('');

  // JSON Import
  const [importJsonText, setImportJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Save all general settings changes
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings({
      spaName: spaName.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      taxRegistrationNumber: taxRegNumber.trim(),
      receiptFooterNote: receiptFooter.trim(),
      themeAccent,
      brandIcon,
      fontDisplay,
      currencySymbol: currencySymbol.trim(),
      currencyCode: currencyCode.trim().toUpperCase(),
      currencyPosition,
      taxName: taxName.trim(),
      taxRate: Number(taxRatePercent) / 100,
      openingTime,
      closingTime,
      slotDurationMinutes: Number(slotDuration),
      loyaltySpendPerPoint: Number(loyaltySpendPerPoint),
      vipSpendThreshold: Number(vipSpendThreshold),
    });
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmName.trim()) return;
    const code = newPmName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    addPaymentMethod({
      name: newPmName.trim(),
      code,
      enabled: true,
    });
    setNewPmName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJson(content);
      }
    };
    reader.readAsText(file);
  };

  const handleImportTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = importDatabaseJson(importJsonText.trim());
    if (success) {
      setIsImporting(false);
      setImportJsonText('');
    }
  };

  const tabs = [
    { id: 'brand', label: 'Theme & Brand', icon: Palette },
    { id: 'profile', label: 'Spa Profile', icon: Building },
    { id: 'currency', label: 'Currency & Tax', icon: DollarSign },
    { id: 'dashboard', label: 'Dashboard Widgets', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories Menu', icon: Layers },
    { id: 'payments', label: 'Tender Methods', icon: CreditCard },
    { id: 'loyalty', label: 'Loyalty Rules', icon: Award },
    { id: 'schedule', label: 'Hours & Shifts', icon: Clock },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header with Title and Global Save CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-stone-100 flex items-center gap-2">
            <span>Sanctuary Customization Center</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure visual themes, brand identity, currencies, dashboard widgets, and menu workflows
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          className={`flex items-center justify-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-4 py-2 text-xs font-semibold shadow-sm self-start sm:self-auto shrink-0 transition-all`}
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? `${theme.lightBg} ${theme.accentText} border ${theme.accentBorder} font-semibold`
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BRAND & VISUAL THEME */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-100">
                Visual Aesthetic &amp; Color Accents
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Choose an authentic palette tailored to your sanctuary style
              </p>
            </div>

            {/* Theme Palettes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(THEME_PALETTES) as ThemeAccent[]).map((key) => {
                const pal = THEME_PALETTES[key];
                const isSelected = themeAccent === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setThemeAccent(key);
                      updateSettings({ themeAccent: key });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-500 bg-stone-900 shadow-md ring-1 ring-amber-500/50'
                        : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-stone-100 capitalize">
                        {key}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">{pal.name}</p>

                    <div className="mt-3 flex items-center gap-1.5">
                      <div className={`h-4 w-8 rounded ${pal.primaryBg}`} />
                      <div className={`h-4 w-8 rounded border ${pal.accentBorder} ${pal.lightBg}`} />
                      <div className="h-4 w-8 rounded bg-stone-900 border border-stone-800" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Monogram Brand Icon Picker */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <label className="text-xs font-semibold text-stone-200 block">
                Brand Monogram Icon
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(['sparkles', 'lotus', 'flower', 'feather', 'heart', 'sun', 'gem', 'leaf', 'droplet', 'moon'] as BrandIcon[]).map(
                  (iconKey) => {
                    const isSelected = brandIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => {
                          setBrandIcon(iconKey);
                          updateSettings({ brandIcon: iconKey });
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                            : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {renderBrandIcon(iconKey, 'h-4 w-4')}
                        <span className="capitalize">{iconKey}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Font Typography Style */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <label className="text-xs font-semibold text-stone-200 block">
                Display Typography Pairing
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setFontDisplay('serif');
                    updateSettings({ fontDisplay: 'serif' });
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    fontDisplay === 'serif'
                      ? 'border-amber-500 bg-amber-500/10 text-stone-100'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="font-serif text-lg font-semibold text-stone-100 block">
                    Cormorant Garamond (Luxury Serif)
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Classical high-end Ayurvedic, 5-star hotel day spa and salon atmosphere.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFontDisplay('sans');
                    updateSettings({ fontDisplay: 'sans' });
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    fontDisplay === 'sans'
                      ? 'border-amber-500 bg-amber-500/10 text-stone-100'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="font-sans text-base font-semibold text-stone-100 block">
                    Plus Jakarta Sans (Modern Clean)
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Contemporary clinical aesthetics, medical dermatology & modern express spa.
                  </span>
                </button>
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <label className="text-xs font-semibold text-stone-400 block">
                Live Brand &amp; Card Preview
              </label>
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-500/30 text-amber-300">
                    {renderBrandIcon(brandIcon, 'h-5 w-5')}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-stone-100">
                      {spaName || 'Aura Sanctuary'}
                    </h4>
                    <p className="text-xs text-stone-400">
                      {tagline || 'Holistic Wellness & Luxury Day Spa'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 font-medium">
                    Sample Ritual · 60m
                  </span>
                  <span className="font-serif text-base font-semibold text-amber-300 tabular-nums">
                    {formatPrice(3500)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPA PROFILE & LEGAL */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveAll} className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Sanctuary Business Details &amp; Invoices
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              These details appear on client thermal receipts, confirmations, and email summaries
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Sanctuary / Business Name *</label>
              <input
                type="text"
                required
                value={spaName}
                onChange={(e) => setSpaName(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Tagline / Mission</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-stone-300">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Concierge Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Concierge Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-stone-300">
              Tax Registration Number (e.g. GSTIN, VAT Number, Trade License)
            </label>
            <input
              type="text"
              placeholder="e.g. 29AABCA1234F1Z8"
              value={taxRegNumber}
              onChange={(e) => setTaxRegNumber(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-stone-300">
              Thermal Receipt / Invoice Footer Blessing &amp; Terms
            </label>
            <textarea
              rows={2}
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-500"
            >
              <Save className="h-4 w-4" />
              <span>Save Sanctuary Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CURRENCY & TAX CONFIGURATION */}
      {activeTab === 'currency' && (
        <form onSubmit={handleSaveAll} className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-5 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Currency, Position &amp; Tax Compliance
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Customize monetary symbols, tax computation, and gratuity scales
            </p>
          </div>

          {/* Quick presets for currencies */}
          <div className="space-y-2">
            <label className="font-medium text-stone-300 block">
              Quick Currency Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { sym: '₹', code: 'INR', label: 'Indian Rupee (₹ INR)' },
                { sym: 'Rs.', code: 'INR', label: 'Rupees (Rs. INR)' },
                { sym: '$', code: 'USD', label: 'US Dollar ($ USD)' },
                { sym: '€', code: 'EUR', label: 'Euro (€ EUR)' },
                { sym: '£', code: 'GBP', label: 'British Pound (£ GBP)' },
                { sym: 'AED', code: 'AED', label: 'UAE Dirham (AED)' },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    setCurrencySymbol(c.sym);
                    setCurrencyCode(c.code);
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    currencySymbol === c.sym && currencyCode === c.code
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">ISO Currency Code</label>
              <input
                type="text"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none uppercase font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Symbol Placement</label>
              <select
                value={currencyPosition}
                onChange={(e) => setCurrencyPosition(e.target.value as 'prefix' | 'suffix')}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="prefix">Prefix (e.g. ₹ 3,500)</option>
                <option value="suffix">Suffix (e.g. 3,500 ₹)</option>
              </select>
            </div>
          </div>

          {/* Tax Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Tax Nomenclature / Name</label>
              <input
                type="text"
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
                placeholder="e.g. GST, VAT, Sales Tax"
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Tax Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="50"
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className={`flex items-center gap-1.5 rounded-lg ${theme.primaryBg} ${theme.primaryHover} ${theme.primaryText} px-5 py-2 text-xs font-semibold shadow-sm transition-all`}
            >
              <Save className="h-4 w-4" />
              <span>Save Financial Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: DASHBOARD WIDGETS & CONSOLE CUSTOMIZATION */}
      {activeTab === 'dashboard' && (
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100 flex items-center gap-2">
              <LayoutDashboard className={`h-5 w-5 ${theme.accentText}`} />
              <span>Dashboard &amp; Console Customizer</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Customize the widgets and information modules displayed on your executive management dashboard
            </p>
          </div>

          {/* Widget Toggles */}
          <div className="space-y-3 rounded-xl border border-stone-800 bg-stone-950/70 p-4 divide-y divide-stone-800/60">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold text-stone-200">Revenue &amp; Operations KPI Cards</p>
                <p className="text-[11px] text-stone-400">Displays Today's Gross Sales, Total Bookings, Suite Occupancy Rate, and Staff Roster</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showKpiStats !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showKpiStats: !(settings.dashboardWidgets?.showKpiStats !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-semibold text-stone-200">Operations Quick Action Dock</p>
                <p className="text-[11px] text-stone-400">Tactile 1-tap buttons for rapid booking, POS checkout, guest registration, and room sanitization</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showQuickActions !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showQuickActions: !(settings.dashboardWidgets?.showQuickActions !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-semibold text-stone-200">Today's Treatment Schedule &amp; Agenda</p>
                <p className="text-[11px] text-stone-400">Live chronological agenda with 1-click Start Session, Complete, and POS Billing actions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showTodaySchedule !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showTodaySchedule: !(settings.dashboardWidgets?.showTodaySchedule !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-semibold text-stone-200">Sanctuary Suites Board</p>
                <p className="text-[11px] text-stone-400">Real-time room occupancy, cleaning/sanitization status, and assigned therapists</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showSuitesStatus !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showSuitesStatus: !(settings.dashboardWidgets?.showSuitesStatus !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-semibold text-stone-200">Treatment Demand &amp; Category Breakdown</p>
                <p className="text-[11px] text-stone-400">Visual percentage distribution of booked massages, facials, wraps, and wellness packages</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showCategoryBreakdown !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showCategoryBreakdown: !(settings.dashboardWidgets?.showCategoryBreakdown !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-semibold text-stone-200">Recent POS Settlements Feed</p>
                <p className="text-[11px] text-stone-400">Live feed of completed transactions with 1-click printable receipt viewing</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dashboardWidgets?.showRecentTransactions !== false}
                onChange={() =>
                  updateSettings({
                    dashboardWidgets: {
                      ...(settings.dashboardWidgets || {
                        showKpiStats: true,
                        showQuickActions: true,
                        showSuitesStatus: true,
                        showTodaySchedule: true,
                        showCategoryBreakdown: true,
                        showRecentTransactions: true,
                      }),
                      showRecentTransactions: !(settings.dashboardWidgets?.showRecentTransactions !== false),
                    },
                  })
                }
                className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* UI Layout Density */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <label className="text-xs font-semibold text-stone-200 block">
              Layout Display Density
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateSettings({ uiDensity: 'comfortable' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  (settings.uiDensity || 'comfortable') === 'comfortable'
                    ? `${theme.lightBg} ${theme.accentText} border ${theme.accentBorder} font-semibold`
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <span className="text-stone-100 font-semibold block">Comfortable (Standard)</span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Generous whitespace, larger touch targets, ideal for tablets, phones, and touch POS registers.
                </span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ uiDensity: 'compact' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  settings.uiDensity === 'compact'
                    ? `${theme.lightBg} ${theme.accentText} border ${theme.accentBorder} font-semibold`
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <span className="text-stone-100 font-semibold block">Compact (High Density)</span>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Tight padding, maximum data visible per screen, ideal for desktop monitors and power front-desk users.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM TREATMENT CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Treatment Categories &amp; Ritual Sections
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Add custom categories to fit your specialized spa, clinic, or salon offerings
            </p>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategorySubmit} className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
            <span className="font-semibold text-stone-200 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              Create Custom Category
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Ayurvedic Panchakarma, Laser Skincare)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Brief description or purpose"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 font-medium text-stone-950 hover:bg-amber-500"
            >
              Add Category to Menu
            </button>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              Active Sanctuary Categories ({settings.categories?.length || 0})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {settings.categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3.5 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-semibold text-stone-100">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-[11px] text-stone-400 mt-0.5">{cat.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Remove category "${cat.name}"?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TENDER & PAYMENT METHODS */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Payment &amp; Settlement Methods
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Toggle accepted tender options or add custom payment gateways
            </p>
          </div>

          {/* Add custom payment method */}
          <form onSubmit={handleAddPaymentSubmit} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. Swiggy Dineout, Corporate Voucher, Cheque"
              value={newPmName}
              onChange={(e) => setNewPmName(e.target.value)}
              className="flex-1 rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 font-medium text-stone-950 hover:bg-amber-500 whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Tender Option</span>
            </button>
          </form>

          {/* Payment Methods Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {settings.paymentMethods?.map((pm) => (
              <div
                key={pm.id}
                className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3.5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-stone-200">{pm.name}</p>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5">code: {pm.code}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePaymentMethod(pm.id)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      pm.enabled
                        ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 font-medium'
                        : 'border-stone-800 text-stone-500 bg-stone-900'
                    }`}
                  >
                    {pm.enabled ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => deletePaymentMethod(pm.id)}
                    className="p-1 rounded text-stone-600 hover:text-rose-400"
                    title="Remove method"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LOYALTY RULES & VIP TIERS */}
      {activeTab === 'loyalty' && (
        <form onSubmit={handleSaveAll} className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-5 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Loyalty Points Program &amp; VIP Criteria
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Configure points accrual, redemption rules, and automatic tier upgrades
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">
                Amount spent to earn 1 loyalty point ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                value={loyaltySpendPerPoint}
                onChange={(e) => setLoyaltySpendPerPoint(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-stone-500">
                e.g. 100 means a guest spending {formatPrice(3500)} receives 35 points
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">
                VIP Tier Qualification Spend Threshold ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={vipSpendThreshold}
                onChange={(e) => setVipSpendThreshold(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-stone-500">
                Clients whose cumulative spend exceeds {formatPrice(vipSpendThreshold)} become VIP automatically
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-500"
            >
              <Save className="h-4 w-4" />
              <span>Save Loyalty Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 7: OPERATING HOURS & SCHEDULE */}
      {activeTab === 'schedule' && (
        <form onSubmit={handleSaveAll} className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-5 text-xs">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-100">
              Sanctuary Operating Schedule &amp; Time Slots
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Control booking availability windows and standard session block durations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Daily Sanctuary Opening Time</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Daily Sanctuary Closing Time</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Agenda Grid Step (Minutes)</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-none"
              >
                <option value={15}>15 Minutes (High granularity)</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (Standard hourly)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-500"
            >
              <Save className="h-4 w-4" />
              <span>Save Schedule Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 8: BACKUP, EXPORT & RESTORE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 text-xs">
          <div className="rounded-2xl border border-stone-800/90 bg-stone-900/40 p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-100 pb-2 border-b border-stone-800">
              Complete Database Export &amp; Backup
            </h3>
            <p className="text-stone-400">
              Export all your custom sanctuary settings, rituals, therapists, suites, clients, appointments, and sales transactions in a single standalone JSON file.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={exportDatabaseJson}
                className="flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 hover:bg-stone-700 transition-colors"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>Export Complete JSON Backup</span>
              </button>

              <label className="flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-xs font-medium text-stone-200 hover:bg-stone-700 transition-colors cursor-pointer">
                <Upload className="h-4 w-4 text-sky-400" />
                <span>Restore from Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsImporting(!isImporting)}
                className="text-stone-400 hover:text-stone-200 underline"
              >
                Paste JSON Text
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all custom settings and data back to default demo state?')) {
                    resetToDemoData();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3.5 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-950/40 transition-colors ml-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>

            {isImporting && (
              <form onSubmit={handleImportTextSubmit} className="space-y-3 pt-4 border-t border-stone-800">
                <label className="font-medium text-stone-300 block">
                  Paste Exported JSON Backup Data
                </label>
                <textarea
                  rows={5}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON file content here..."
                  className="w-full rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-medium text-stone-950 hover:bg-amber-500"
                  >
                    Import &amp; Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsImporting(false)}
                    className="rounded-lg px-4 py-1.5 text-xs text-stone-400 hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
