import { create } from 'zustand';
import { PackingItem, Expense, NotificationItem } from '@/types';
import { MOCK_PACKING_ITEMS, MOCK_EXPENSES, MOCK_NOTIFICATIONS } from '@/data/mockData';

interface ExtensionState {
  packingItems: PackingItem[];
  togglePackingItem: (id: string) => void;
  
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

export const useExtensionStore = create<ExtensionState>((set) => ({
  packingItems: MOCK_PACKING_ITEMS,
  togglePackingItem: (id) => set((state) => ({
    packingItems: state.packingItems.map(item => 
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    )
  })),
  
  expenses: MOCK_EXPENSES,
  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, { ...expense, id: `e${Date.now()}` }]
  })),
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter(e => e.id !== id)
  })),
  
  notifications: MOCK_NOTIFICATIONS,
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ),
    unreadCount: state.notifications.filter(n => n.id !== id && !n.isRead).length
  })),
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length
}));
