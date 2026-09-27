export type AppointmentStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type ServiceCategory = string;
export type RoomType = 'massage' | 'facial' | 'hydro' | 'couple_suite' | 'relaxation' | 'any';
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';
export type PaymentMethod = string;
export type ClientTier = 'VIP' | 'Regular' | 'New';

export type ThemeAccent = 'amber' | 'emerald' | 'rose' | 'sapphire' | 'slate' | 'teal' | 'purple';
export type BrandIcon = 'sparkles' | 'lotus' | 'flower' | 'feather' | 'heart' | 'sun' | 'gem' | 'leaf' | 'droplet' | 'moon';

export interface DashboardWidgetConfig {
  showKpiStats: boolean;
  showQuickActions: boolean;
  showSuitesStatus: boolean;
  showTodaySchedule: boolean;
  showCategoryBreakdown: boolean;
  showRecentTransactions: boolean;
}

export interface CustomCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CustomPaymentMethod {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  roomId: string;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  duration: number; // minutes
  endTime: string; // HH:MM (24h)
  price: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  allergyNotice?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: ClientTier;
  notes: string;
  allergies: string;
  skinType?: string;
  totalSpent: number;
  visitsCount: number;
  lastVisit?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number; // in minutes
  price: number;
  description: string;
  therapistCommissionRate: number; // e.g. 0.25 = 25%
  requiredRoomType: RoomType;
  isActive: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  rating: number;
  specialties: string[];
  commissionRate: number;
  appointmentsCount: number;
  revenueGenerated: number;
  workingHours: {
    start: string;
    end: string;
  };
  offDays: string[];
  isActive: boolean;
}

export interface TreatmentRoom {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  currentAppointmentId?: string;
  currentTherapistName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'oils' | 'skincare' | 'candles_aroma' | 'scrubs' | 'linen_amenities' | string;
  sku: string;
  stock: number;
  minStock: number;
  unitCost: number;
  retailPrice: number;
  supplier: string;
  lastRestocked: string;
}

export interface CartItem {
  id: string;
  name: string;
  type: 'service' | 'product';
  price: number;
  quantity: number;
}

export interface SaleTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  appointmentId?: string;
  clientId?: string;
  clientName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountPercentage: number;
  tip: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface SpaSettings {
  spaName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  taxRegistrationNumber: string; // GSTIN / Tax ID
  receiptFooterNote: string;

  // Theme & Visuals
  themeAccent: ThemeAccent;
  brandIcon: BrandIcon;
  fontDisplay: 'serif' | 'sans';

  // Currency & Taxes
  currencySymbol: string;
  currencyCode: string;
  currencyPosition: 'prefix' | 'suffix';
  taxName: string;
  taxRate: number; // e.g. 0.18 = 18%
  tipPresets: number[]; // e.g. [0, 5, 10, 15, 20]

  // Operations Schedule
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  workingDays: string[];

  // Loyalty Program
  loyaltySpendPerPoint: number;
  loyaltyPointValue: number;
  vipSpendThreshold: number;

  // Custom Categories & Payment Methods
  categories: CustomCategory[];
  paymentMethods: CustomPaymentMethod[];

  // Customizable Dashboard Widgets & Layout
  dashboardWidgets?: DashboardWidgetConfig;
  uiDensity?: 'comfortable' | 'compact';
}
