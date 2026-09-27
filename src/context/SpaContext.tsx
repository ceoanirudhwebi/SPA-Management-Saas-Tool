import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appointment,
  AppointmentStatus,
  Client,
  Service,
  Therapist,
  TreatmentRoom,
  InventoryItem,
  SaleTransaction,
  SpaSettings,
  RoomStatus,
  CartItem,
  PaymentMethod,
  CustomCategory,
  CustomPaymentMethod,
  ThemeAccent
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_ROOMS,
  INITIAL_THERAPISTS,
  INITIAL_CLIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVENTORY,
  INITIAL_TRANSACTIONS,
  getOffsetDate
} from '../data/mockData';
import { THEME_PALETTES, ThemeColorStyles } from '../utils/theme';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface SpaContextType {
  // State
  settings: SpaSettings;
  theme: ThemeColorStyles;
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  therapists: Therapist[];
  rooms: TreatmentRoom[];
  inventory: InventoryItem[];
  transactions: SaleTransaction[];
  selectedDate: string;
  activeView: string;
  toasts: Toast[];

  // View navigation
  setActiveView: (view: string) => void;
  setSelectedDate: (date: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'visitsCount' | 'loyaltyPoints'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Service actions
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Custom Categories & Payment Methods
  addCategory: (category: Omit<CustomCategory, 'id'>) => void;
  updateCategory: (id: string, name: string, description?: string) => void;
  deleteCategory: (id: string) => void;
  addPaymentMethod: (pm: Omit<CustomPaymentMethod, 'id'>) => void;
  togglePaymentMethod: (id: string) => void;
  deletePaymentMethod: (id: string) => void;

  // Staff / Therapist actions
  addTherapist: (therapist: Omit<Therapist, 'id' | 'appointmentsCount' | 'revenueGenerated'>) => void;
  updateTherapist: (id: string, updates: Partial<Therapist>) => void;
  toggleTherapistStatus: (id: string) => void;

  // Room actions
  updateRoomStatus: (id: string, status: RoomStatus) => void;
  addRoom: (room: Omit<TreatmentRoom, 'id'>) => void;

  // Inventory actions
  adjustStock: (id: string, delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // POS & Transactions
  completeCheckout: (data: {
    appointmentId?: string;
    clientId?: string;
    clientName: string;
    items: CartItem[];
    discountPercentage: number;
    tip: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => SaleTransaction;

  // Settings & System
  updateSettings: (newSettings: Partial<SpaSettings>) => void;
  resetToDemoData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;

  // Helpers
  formatPrice: (amount: number) => string;
}

const SpaContext = createContext<SpaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'auraspa_settings',
  APPOINTMENTS: 'auraspa_appointments',
  CLIENTS: 'auraspa_clients',
  SERVICES: 'auraspa_services',
  THERAPISTS: 'auraspa_therapists',
  ROOMS: 'auraspa_rooms',
  INVENTORY: 'auraspa_inventory',
  TRANSACTIONS: 'auraspa_transactions',
};

export const SpaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or fallbacks with automatic merge
  const [settings, setSettings] = useState<SpaSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial settings so any newly introduced properties exist
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          categories: parsed.categories?.length ? parsed.categories : INITIAL_SETTINGS.categories,
          paymentMethods: parsed.paymentMethods?.length ? parsed.paymentMethods : INITIAL_SETTINGS.paymentMethods,
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [therapists, setTherapists] = useState<Therapist[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THERAPISTS);
      return saved ? JSON.parse(saved) : INITIAL_THERAPISTS;
    } catch {
      return INITIAL_THERAPISTS;
    }
  });

  const [rooms, setRooms] = useState<TreatmentRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [selectedDate, setSelectedDate] = useState<string>(getOffsetDate(0));
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Current active theme colors
  const theme = THEME_PALETTES[settings.themeAccent || 'amber'] || THEME_PALETTES.amber;

  // Sync to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(therapists));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [therapists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [transactions]);

  // Toast notifications
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPrice = (amount: number): string => {
    const isINR =
      settings.currencyCode === 'INR' ||
      settings.currencySymbol === '₹' ||
      settings.currencySymbol.toLowerCase().includes('rs');

    const locale = isINR ? 'en-IN' : 'en-US';
    const formatted = Math.abs(amount).toLocaleString(locale, {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });

    const symbol = settings.currencySymbol || '₹';
    const prefix = amount < 0 ? '-' : '';
    const position = settings.currencyPosition || 'prefix';

    if (position === 'suffix') {
      return `${prefix}${formatted} ${symbol}`;
    }

    const spacing = symbol.toLowerCase().includes('rs') || symbol.length > 1 ? ' ' : '';
    return `${prefix}${symbol}${spacing}${formatted}`;
  };

  // Appointment Handlers
  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Update room status if it's for today and confirmed
    if (newApt.date === getOffsetDate(0) && (newApt.status === 'confirmed' || newApt.status === 'in_progress')) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === newApt.roomId
            ? {
                ...r,
                status: newApt.status === 'in_progress' ? 'occupied' : r.status,
                currentAppointmentId: newApt.id,
                currentTherapistName: newApt.therapistName,
              }
            : r
        )
      );
    }

    showToast(`Appointment booked for ${newApt.clientName}`, 'success');
    return newApt;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    );
    showToast('Appointment updated successfully', 'success');
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    let servicePrice = 0;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          servicePrice = apt.price;
          return { ...apt, status };
        }
        return apt;
      })
    );

    // If marked in_progress, update room to occupied
    const targetApt = appointments.find((a) => a.id === id);
    if (targetApt) {
      if (status === 'in_progress') {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === targetApt.roomId
              ? { ...r, status: 'occupied', currentAppointmentId: targetApt.id, currentTherapistName: targetApt.therapistName }
              : r
          )
        );
      } else if (status === 'completed') {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === targetApt.roomId
              ? { ...r, status: 'cleaning', currentAppointmentId: undefined, currentTherapistName: undefined }
              : r
          )
        );

        // Increment therapist stats
        setTherapists((prev) =>
          prev.map((th) =>
            th.id === targetApt.therapistId
              ? {
                  ...th,
                  appointmentsCount: th.appointmentsCount + 1,
                  revenueGenerated: th.revenueGenerated + servicePrice,
                }
              : th
          )
        );
      }
    }

    showToast(`Appointment status updated to ${status.replace('_', ' ')}`, 'info');
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment removed', 'info');
  };

  // Client Handlers
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'visitsCount' | 'loyaltyPoints'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cl-${Date.now()}`,
      totalSpent: 0,
      visitsCount: 0,
      loyaltyPoints: 10,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client profile created for ${newClient.name}`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Client profile updated', 'success');
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Client deleted', 'info');
  };

  // Service Handlers
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    showToast(`Treatment ritual "${newService.name}" created`, 'success');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Treatment ritual updated', 'success');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Treatment removed', 'info');
  };

  // Custom Categories
  const addCategory = (categoryData: Omit<CustomCategory, 'id'>) => {
    const newCat: CustomCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setSettings((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCat],
    }));
    showToast(`Category "${newCat.name}" added`, 'success');
  };

  const updateCategory = (id: string, name: string, description?: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name, description } : c)),
    }));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
    showToast('Category removed', 'info');
  };

  // Custom Payment Methods
  const addPaymentMethod = (pmData: Omit<CustomPaymentMethod, 'id'>) => {
    const newPm: CustomPaymentMethod = {
      ...pmData,
      id: `pm-${Date.now()}`,
    };
    setSettings((prev) => ({
      ...prev,
      paymentMethods: [...(prev.paymentMethods || []), newPm],
    }));
    showToast(`Payment method "${newPm.name}" added`, 'success');
  };

  const togglePaymentMethod = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) =>
        pm.id === id ? { ...pm, enabled: !pm.enabled } : pm
      ),
    }));
  };

  const deletePaymentMethod = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((pm) => pm.id !== id),
    }));
    showToast('Payment method removed', 'info');
  };

  // Staff Handlers
  const addTherapist = (therapistData: Omit<Therapist, 'id' | 'appointmentsCount' | 'revenueGenerated'>) => {
    const newTherapist: Therapist = {
      ...therapistData,
      id: `th-${Date.now()}`,
      appointmentsCount: 0,
      revenueGenerated: 0,
    };
    setTherapists((prev) => [...prev, newTherapist]);
    showToast(`Staff member ${newTherapist.name} added`, 'success');
  };

  const updateTherapist = (id: string, updates: Partial<Therapist>) => {
    setTherapists((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Staff profile updated', 'success');
  };

  const toggleTherapistStatus = (id: string) => {
    setTherapists((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  // Room Handlers
  const updateRoomStatus = (id: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(status === 'available'
                ? { currentAppointmentId: undefined, currentTherapistName: undefined }
                : {}),
            }
          : r
      )
    );
    showToast(`Room status marked as ${status}`, 'info');
  };

  const addRoom = (roomData: Omit<TreatmentRoom, 'id'>) => {
    const newRoom: TreatmentRoom = {
      ...roomData,
      id: `rm-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
    showToast(`Treatment room "${newRoom.name}" added`, 'success');
  };

  // Inventory Handlers
  const adjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            lastRestocked: delta > 0 ? getOffsetDate(0) : item.lastRestocked,
          };
        }
        return item;
      })
    );
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      lastRestocked: getOffsetDate(0),
    };
    setInventory((prev) => [...prev, newItem]);
    showToast(`Product "${newItem.name}" added to inventory`, 'success');
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Inventory item updated', 'success');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    showToast('Product removed from inventory', 'info');
  };

  // Checkout POS Transaction
  const completeCheckout = (data: {
    appointmentId?: string;
    clientId?: string;
    clientName: string;
    items: CartItem[];
    discountPercentage: number;
    tip: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): SaleTransaction => {
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (subtotal * data.discountPercentage) / 100;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * settings.taxRate;
    const total = taxableAmount + tax + data.tip;

    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: SaleTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      date: getOffsetDate(0),
      appointmentId: data.appointmentId,
      clientId: data.clientId,
      clientName: data.clientName,
      items: data.items,
      subtotal,
      discount,
      discountPercentage: data.discountPercentage,
      tip: data.tip,
      tax,
      total,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If an appointment was linked, mark as paid & completed
    if (data.appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === data.appointmentId
            ? { ...apt, paymentStatus: 'paid', status: 'completed' }
            : apt
        )
      );

      // Free room to cleaning
      const matchedApt = appointments.find((a) => a.id === data.appointmentId);
      if (matchedApt) {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === matchedApt.roomId
              ? { ...r, status: 'cleaning', currentAppointmentId: undefined, currentTherapistName: undefined }
              : r
          )
        );
      }
    }

    // Decrement inventory for retail product items in cart
    data.items.forEach((item) => {
      if (item.type === 'product') {
        adjustStock(item.id, -item.quantity);
      }
    });

    // Update Client Lifetime Spent, Visits, and Loyalty points using customizable rules
    if (data.clientId) {
      const spendPerPt = settings.loyaltySpendPerPoint || 100;
      const earnedPoints = Math.floor(total / spendPerPt);
      const vipThreshold = settings.vipSpendThreshold || 50000;

      setClients((prev) =>
        prev.map((c) =>
          c.id === data.clientId
            ? {
                ...c,
                totalSpent: c.totalSpent + total,
                visitsCount: c.visitsCount + 1,
                lastVisit: getOffsetDate(0),
                loyaltyPoints: c.loyaltyPoints + earnedPoints,
                tier: c.totalSpent + total >= vipThreshold ? 'VIP' : c.visitsCount + 1 >= 3 ? 'Regular' : c.tier,
              }
            : c
        )
      );
    }

    showToast(`Payment of ${formatPrice(total)} completed (${receiptNum})`, 'success');
    return newTx;
  };

  const updateSettings = (newSettings: Partial<SpaSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Sanctuary customizations saved', 'success');
  };

  const resetToDemoData = () => {
    setSettings(INITIAL_SETTINGS);
    setServices(INITIAL_SERVICES);
    setRooms(INITIAL_ROOMS);
    setTherapists(INITIAL_THERAPISTS);
    setClients(INITIAL_CLIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInventory(INITIAL_INVENTORY);
    setTransactions(INITIAL_TRANSACTIONS);
    setSelectedDate(getOffsetDate(0));
    localStorage.clear();
    showToast('Reset to original demo data', 'info');
  };

  const exportDatabaseJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      settings,
      appointments,
      clients,
      services,
      therapists,
      rooms,
      inventory,
      transactions,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auraspa-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exported successfully', 'success');
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.appointments) setAppointments(parsed.appointments);
      if (parsed.clients) setClients(parsed.clients);
      if (parsed.services) setServices(parsed.services);
      if (parsed.therapists) setTherapists(parsed.therapists);
      if (parsed.rooms) setRooms(parsed.rooms);
      if (parsed.inventory) setInventory(parsed.inventory);
      if (parsed.transactions) setTransactions(parsed.transactions);
      showToast('Database imported successfully', 'success');
      return true;
    } catch {
      showToast('Invalid JSON file format', 'error');
      return false;
    }
  };

  return (
    <SpaContext.Provider
      value={{
        settings,
        theme,
        appointments,
        clients,
        services,
        therapists,
        rooms,
        inventory,
        transactions,
        selectedDate,
        activeView,
        toasts,
        setActiveView,
        setSelectedDate,
        showToast,
        removeToast,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addClient,
        updateClient,
        deleteClient,
        addService,
        updateService,
        deleteService,
        addCategory,
        updateCategory,
        deleteCategory,
        addPaymentMethod,
        togglePaymentMethod,
        deletePaymentMethod,
        addTherapist,
        updateTherapist,
        toggleTherapistStatus,
        updateRoomStatus,
        addRoom,
        adjustStock,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        completeCheckout,
        updateSettings,
        resetToDemoData,
        exportDatabaseJson,
        importDatabaseJson,
        formatPrice,
      }}
    >
      {children}
    </SpaContext.Provider>
  );
};

export const useSpa = () => {
  const context = useContext(SpaContext);
  if (!context) {
    throw new Error('useSpa must be used within a SpaProvider');
  }
  return context;
};
