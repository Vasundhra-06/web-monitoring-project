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

// Helper functions for localStorage persistence
const saveSources = (sources: Source[]) => {
  localStorage.setItem('app_sources', JSON.stringify(sources));
};

const loadSources = (): Source[] => {
  try {
    const data = localStorage.getItem('app_sources');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('app_notifications', JSON.stringify(notifications));
};

const loadNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem('app_notifications');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveOpportunities = (opportunities: Opportunity[]) => {
  localStorage.setItem('app_opportunities', JSON.stringify(opportunities));
};

const loadOpportunities = (): Opportunity[] => {
  try {
    const data = localStorage.getItem('app_opportunities');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

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
    } catch {
      console.warn("Backend API /auth/me unreachable, loading saved client user profile");
      const savedUserStr = localStorage.getItem('user_profile');
      if (savedUserStr) {
        try {
          set({ currentUser: JSON.parse(savedUserStr) });
        } catch {
          set({ currentUser: { full_name: 'Vasundhra', email: 'vasundhrathanga20@gmail.com', role: 'user' } });
        }
      } else {
        set({ currentUser: { full_name: 'Vasundhra', email: 'vasundhrathanga20@gmail.com', role: 'user' } });
      }
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
    } catch {
      console.warn("Backend API unreachable, loading data from localStorage");
      const localSources = loadSources();
      const localNotifications = loadNotifications();
      const localOpportunities = loadOpportunities();
      const savedUserStr = localStorage.getItem('user_profile');
      let user = null;
      if (savedUserStr) {
        try { user = JSON.parse(savedUserStr); } catch { /* ignore */ }
      }
      set({
        sources: localSources,
        notifications: localNotifications,
        opportunities: localOpportunities,
        currentUser: user || { full_name: 'Vasundhra', email: 'vasundhrathanga20@gmail.com', role: 'user' },
        savedCount: localOpportunities.filter(o => o.saved).length
      });
    } finally {
      set({ loading: false });
    }
  },

  toggleSaveOpportunity: async (id) => {
    const updated = get().opportunities.map(o => 
      o.id === id ? { ...o, saved: !o.saved } : o
    );
    set({
      opportunities: updated,
      savedCount: updated.filter(o => o.saved).length
    });
    saveOpportunities(updated);
    try {
      await apiClient.put(`/opportunities/${id}/save`);
    } catch {
      console.warn("Backend API unreachable, saved locally");
    }
  },

  markOpportunityRead: (id) => {
    const updated = get().opportunities.map(o => o.id === id ? { ...o, read: true } : o);
    set({ opportunities: updated });
    saveOpportunities(updated);
  },

  addSource: async (source) => {
    const newSource: Source = {
      id: 'src_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: source.name,
      type: source.type,
      url: source.url,
      status: 'Active',
      last_scan: new Date().toISOString(),
      updates_today: 0
    };

    const updatedSources = [...get().sources, newSource];
    set({ sources: updatedSources });
    saveSources(updatedSources);

    // Generate a notification for the new source
    const newNotification: Notification = {
      id: 'notif_' + Date.now(),
      title: 'New Source Added',
      message: `"${source.name}" (${source.type}) is now being monitored.`,
      priority: 'Medium',
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedNotifications = [newNotification, ...get().notifications];
    set({ notifications: updatedNotifications });
    saveNotifications(updatedNotifications);

    try {
      await apiClient.post('/sources', source);
    } catch {
      console.warn("Backend API unreachable, source saved locally");
    }
  },

  toggleSourceStatus: async (id) => {
    const updatedSources = get().sources.map(s => 
      s.id === id ? { ...s, status: (s.status === 'Active' ? 'Paused' : 'Active') as 'Active' | 'Paused' } : s
    );
    set({ sources: updatedSources });
    saveSources(updatedSources);

    try {
      await apiClient.put(`/sources/${id}/toggle`);
    } catch {
      console.warn("Backend API unreachable, status toggled locally");
    }
  },

  deleteSource: async (id) => {
    const sourceToDelete = get().sources.find(s => s.id === id);
    const updatedSources = get().sources.filter(s => s.id !== id);
    set({ sources: updatedSources });
    saveSources(updatedSources);

    // Generate a notification for the deleted source
    if (sourceToDelete) {
      const newNotification: Notification = {
        id: 'notif_' + Date.now(),
        title: 'Source Removed',
        message: `"${sourceToDelete.name}" has been removed from monitoring.`,
        priority: 'Low',
        timestamp: new Date().toISOString(),
        read: false
      };
      const updatedNotifications = [newNotification, ...get().notifications];
      set({ notifications: updatedNotifications });
      saveNotifications(updatedNotifications);
    }

    try {
      await apiClient.delete(`/sources/${id}`);
    } catch {
      console.warn("Backend API unreachable, source deleted locally");
    }
  },

  markNotificationRead: async (id) => {
    const updatedNotifications = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    set({ notifications: updatedNotifications });
    saveNotifications(updatedNotifications);

    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch {
      console.warn("Backend API unreachable, notification marked locally");
    }
  },

  clearNotifications: async () => {
    set({ notifications: [] });
    saveNotifications([]);

    try {
      await apiClient.delete('/notifications/clear');
    } catch {
      console.warn("Backend API unreachable, notifications cleared locally");
    }
  }
}));
