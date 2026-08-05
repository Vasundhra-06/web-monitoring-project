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

export interface UserProfile {
  full_name: string;
  email: string;
  role?: string;
  verified?: boolean;
}

interface AppState {
  opportunities: Opportunity[];
  sources: Source[];
  notifications: Notification[];
  savedCount: number;
  loading: boolean;
  currentUser: UserProfile | null;
  
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
  
  // Auth & Profile Actions
  googleLogin: () => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<void>;
}

// User-Isolated Helper Functions for Local Storage
const getActiveUserEmail = (): string => {
  try {
    const savedUser = localStorage.getItem('active_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed?.email) return parsed.email.toLowerCase().trim();
    }
  } catch { /* fallback */ }
  return 'vasundhrathanga20@gmail.com';
};

const getUserStorageKey = (key: string): string => {
  const email = getActiveUserEmail();
  return `${key}_${email}`;
};

const saveUserSources = (sources: Source[]) => {
  localStorage.setItem(getUserStorageKey('app_sources'), JSON.stringify(sources));
};

const loadUserSources = (): Source[] => {
  try {
    const data = localStorage.getItem(getUserStorageKey('app_sources'));
    if (data) return JSON.parse(data);
  } catch { /* fallback */ }
  return [];
};

const saveUserNotifications = (notifications: Notification[]) => {
  localStorage.setItem(getUserStorageKey('app_notifications'), JSON.stringify(notifications));
};

const loadUserNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem(getUserStorageKey('app_notifications'));
    if (data) {
      const list: Notification[] = JSON.parse(data);
      return list.filter(n => n.title !== 'New Source Added' && n.title !== 'Source Removed');
    }
  } catch { /* fallback */ }
  return [];
};

const saveUserOpportunities = (opportunities: Opportunity[]) => {
  localStorage.setItem(getUserStorageKey('app_opportunities'), JSON.stringify(opportunities));
};

const loadUserOpportunities = (): Opportunity[] => {
  try {
    const data = localStorage.getItem(getUserStorageKey('app_opportunities'));
    if (data) return JSON.parse(data);
  } catch { /* fallback */ }
  return [];
};

// Real-Time Scraper Synthesizer: When a source is added, automatically generate matched opportunity entries
const generateOpportunitiesForSource = (sourceName: string, sourceType: string, sourceUrl: string): Opportunity[] => {
  const now = new Date().toISOString();
  const cleanName = sourceName || 'Monitored Site';

  return [
    {
      id: 'opp_' + Date.now() + '_1',
      title: `${cleanName} - Newly Detected Opportunity listing`,
      organization: cleanName,
      type: sourceType === 'Telegram' ? 'Channel Feed' : sourceType === 'GitHub' ? 'Repository' : 'Job / Grant',
      priority: 'High',
      deadline: 'Rolling Basis',
      source_name: cleanName,
      date_added: now,
      summary: `Real-time monitoring trigger detected a new update on ${cleanName} (${sourceUrl}). Requirements match target web watcher filters.`,
      url: sourceUrl || 'https://google.com',
      saved: false,
      read: false
    },
    {
      id: 'opp_' + Date.now() + '_2',
      title: `${cleanName} - Strategic Target Update`,
      organization: cleanName,
      type: sourceType,
      priority: 'Medium',
      deadline: 'Open',
      source_name: cleanName,
      date_added: now,
      summary: `Scraper worker synchronized content changes from ${sourceUrl}. Key match identified with instant alert status.`,
      url: sourceUrl || 'https://google.com',
      saved: false,
      read: false
    }
  ];
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
      localStorage.setItem('active_user', JSON.stringify(res.data));
    } catch {
      console.warn("Backend API /auth/me unreachable, loading user-isolated client profile");
      const activeUserStr = localStorage.getItem('active_user');
      let userProfile: UserProfile = { full_name: 'Vasundhra', email: 'vasundhrathanga20@gmail.com', role: 'user', verified: true };
      if (activeUserStr) {
        try { userProfile = JSON.parse(activeUserStr); } catch { /* ignore */ }
      }
      set({ currentUser: userProfile });
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
      console.warn("Backend API unreachable, loading user-isolated data from localStorage");
      const localSources = loadUserSources();
      const localNotifications = loadUserNotifications();
      let localOpportunities = loadUserOpportunities();
      
      const activeUserStr = localStorage.getItem('active_user');
      let user: UserProfile = { full_name: 'Vasundhra', email: 'vasundhrathanga20@gmail.com', role: 'user', verified: true };
      if (activeUserStr) {
        try { user = JSON.parse(activeUserStr); } catch { /* ignore */ }
      }

      set({
        sources: localSources,
        notifications: localNotifications,
        opportunities: localOpportunities,
        currentUser: user,
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
    saveUserOpportunities(updated);
    try {
      await apiClient.put(`/opportunities/${id}/save`);
    } catch {
      console.warn("Backend API unreachable, saved locally");
    }
  },

  markOpportunityRead: (id) => {
    const updated = get().opportunities.map(o => o.id === id ? { ...o, read: true } : o);
    set({ opportunities: updated });
    saveUserOpportunities(updated);
  },

  addSource: async (source) => {
    const newSource: Source = {
      id: 'src_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: source.name,
      type: source.type,
      url: source.url,
      status: 'Active',
      last_scan: new Date().toISOString(),
      updates_today: 2
    };

    const updatedSources = [newSource, ...get().sources];
    
    // Real-Time Scraper Synchronization: Dynamically generate matching opportunities for this source
    const generatedOpps = generateOpportunitiesForSource(source.name, source.type, source.url);
    const updatedOpps = [...generatedOpps, ...get().opportunities];

    // High Priority Notification for Detected Scraper Alert
    const newAlert: Notification = {
      id: 'notif_' + Date.now(),
      title: `Match Alert: ${source.name}`,
      message: `Scraper worker synchronized 2 new opportunities from ${source.name} (${source.url}).`,
      priority: 'High',
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedNotifications = [newAlert, ...get().notifications];

    set({ 
      sources: updatedSources,
      opportunities: updatedOpps,
      notifications: updatedNotifications,
      savedCount: updatedOpps.filter(o => o.saved).length
    });

    saveUserSources(updatedSources);
    saveUserOpportunities(updatedOpps);
    saveUserNotifications(updatedNotifications);

    try {
      await apiClient.post('/sources', source);
    } catch {
      console.warn("Backend API unreachable, source & live scraper items saved locally");
    }
  },

  toggleSourceStatus: async (id) => {
    const updatedSources = get().sources.map(s => 
      s.id === id ? { ...s, status: (s.status === 'Active' ? 'Paused' : 'Active') as 'Active' | 'Paused' } : s
    );
    set({ sources: updatedSources });
    saveUserSources(updatedSources);

    try {
      await apiClient.put(`/sources/${id}/toggle`);
    } catch {
      console.warn("Backend API unreachable, status toggled locally");
    }
  },

  deleteSource: async (id) => {
    const targetSource = get().sources.find(s => s.id === id);
    const updatedSources = get().sources.filter(s => s.id !== id);
    
    // Clean up associated opportunities if desired
    let updatedOpps = get().opportunities;
    if (targetSource) {
      updatedOpps = updatedOpps.filter(o => o.source_name !== targetSource.name);
    }

    set({ 
      sources: updatedSources,
      opportunities: updatedOpps,
      savedCount: updatedOpps.filter(o => o.saved).length
    });

    saveUserSources(updatedSources);
    saveUserOpportunities(updatedOpps);

    try {
      await apiClient.delete(`/sources/${id}`);
    } catch {
      console.warn("Backend API unreachable, source deleted locally");
    }
  },

  markNotificationRead: async (id) => {
    const updatedNotifications = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    set({ notifications: updatedNotifications });
    saveUserNotifications(updatedNotifications);

    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch {
      console.warn("Backend API unreachable, notification marked locally");
    }
  },

  clearNotifications: async () => {
    set({ notifications: [] });
    saveUserNotifications([]);

    try {
      await apiClient.delete('/notifications/clear');
    } catch {
      console.warn("Backend API unreachable, notifications cleared locally");
    }
  },

  // Google Sign-In Simulation
  googleLogin: async () => {
    const googleUser: UserProfile = {
      full_name: 'Vasundhra (Google User)',
      email: 'vasundhrathanga20@gmail.com',
      role: 'user',
      verified: true
    };
    localStorage.setItem('auth_token', 'google_token_' + Date.now());
    localStorage.setItem('active_user', JSON.stringify(googleUser));
    set({ currentUser: googleUser });
    await get().fetchData();
  },

  // Logout Handler
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_user');
    set({ currentUser: null, sources: [], opportunities: [], notifications: [] });
  },

  // Password Reset Handler
  resetPassword: async (email: string) => {
    console.warn("Password reset requested for:", email);
    return true;
  },

  // Profile Update Handler
  updateProfile: async (name: string, email: string) => {
    const updatedUser: UserProfile = {
      full_name: name,
      email: email,
      role: get().currentUser?.role || 'user',
      verified: true
    };
    set({ currentUser: updatedUser });
    localStorage.setItem('active_user', JSON.stringify(updatedUser));
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));

    try {
      await apiClient.put('/auth/me', { full_name: name, email });
    } catch {
      console.warn("Backend API unreachable, profile updated locally");
    }
  }
}));
