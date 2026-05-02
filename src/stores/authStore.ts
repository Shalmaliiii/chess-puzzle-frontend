import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr.response?.data?.message || (err instanceof Error ? err.message : 'Login failed');
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (email, username, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register({ email, username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr.response?.data?.message || (err instanceof Error ? err.message : 'Registration failed');
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const user = await userService.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
