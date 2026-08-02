import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  source_name: string;
  date_added: string;
  summary: string;
  url: string;
  saved: boolean;
  read: boolean;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  url: string;
  status: 'Active' | 'Paused' | 'Error';
  last_scan: string | null;
  updates_today: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
  read: boolean;
}

interface AppState {
  opportunities: Opportunity[];
  sources: Source[];
  notifications: Notification[];
  savedCount: number;
  loading: boolean;
  currentUser: { full_name: string, email: string, role?: string } | null;
  
  // Actions
  fetchData: () => Promise<void>;
  fetchUser: () => Promise<void>;
  toggleSaveOpportunity: (id: string) => Promise<void>;
  markOpportunityRead: (id: string) => void;
  addSource: (source: { name: string, type: string, url: string }) => Promise<void>;
  toggleSourceStatus: (id: string) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  opportunities: [],
  sources: [],
  notifications: [],
  savedCount: 0,
  loading: false,
  currentUser: null,

  fetchUser: async () => {
    try {
      const res = await apiClient.get('/auth/me');
      set({ currentUser: res.data });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },

  fetchData: async () => {
    set({ loading: true });
    try {
      const [oppRes, srcRes, notifRes, userRes] = await Promise.all([
        apiClient.get('/opportunities'),
        apiClient.get('/sources'),
        apiClient.get('/notifications'),
        apiClient.get('/auth/me').catch(() => ({ data: null }))
      ]);
      set({ 
        opportunities: oppRes.data, 
        sources: srcRes.data,
        notifications: notifRes.data,
        currentUser: userRes.data,
        savedCount: oppRes.data.filter((o: Opportunity) => o.saved).length
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleSaveOpportunity: async (id) => {
    try {
      await apiClient.put(`/opportunities/${id}/save`);
      const updated = get().opportunities.map(o => 
        o.id === id ? { ...o, saved: !o.saved } : o
      );
      set({
        opportunities: updated,
        savedCount: updated.filter(o => o.saved).length
      });
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  },

  markOpportunityRead: (id) => set((state) => ({
    opportunities: state.opportunities.map(o => o.id === id ? { ...o, read: true } : o)
  })),

  addSource: async (source) => {
    try {
      const res = await apiClient.post('/sources', source);
      set((state) => ({
        sources: [...state.sources, res.data]
      }));
    } catch (error) {
      console.error("Failed to add source:", error);
    }
  },

  toggleSourceStatus: async (id) => {
    try {
      await apiClient.put(`/sources/${id}/toggle`);
      set((state) => ({
        sources: state.sources.map(s => 
          s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s
        )
      }));
    } catch (error) {
      console.error("Failed to toggle source:", error);
    }
  },

  deleteSource: async (id) => {
    try {
      await apiClient.delete(`/sources/${id}`);
      set((state) => ({
        sources: state.sources.filter(s => s.id !== id)
      }));
    } catch (error) {
      console.error("Failed to delete source:", error);
    }
  },

  markNotificationRead: async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      }));
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    }
  },

  clearNotifications: async () => {
    try {
      await apiClient.delete('/notifications/clear');
      set({ notifications: [] });
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  }
}));
