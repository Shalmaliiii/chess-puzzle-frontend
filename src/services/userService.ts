import api from './api';
import type { User, LeaderboardEntry } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
    const response = await api.get<LeaderboardEntry[]>('/users/leaderboard', {
      params: { limit },
    });
    return response.data;
  },

  async getUserStats(userId: string): Promise<User> {
    const response = await api.get<User>(`/users/${userId}/stats`);
    return response.data;
  },
};
