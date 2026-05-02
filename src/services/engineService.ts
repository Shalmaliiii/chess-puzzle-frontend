import api from './api';
import type { EngineAnalysisRequest, EngineAnalysisResponse } from '../types';

export const engineService = {
  async analyze(data: EngineAnalysisRequest): Promise<EngineAnalysisResponse> {
    const response = await api.post<EngineAnalysisResponse>('/engine/analyze', data);
    return response.data;
  },

  async validateMove(fen: string, move: string): Promise<{ isBestMove: boolean; engineBestMove: string; evaluation: string }> {
    const response = await api.post('/engine/validate-move', { fen, move });
    return response.data;
  },

  async healthCheck(): Promise<{ status: string; engineVersion: string; poolSize: number; activeWorkers: number }> {
    const response = await api.get('/engine/health');
    return response.data;
  },
};
