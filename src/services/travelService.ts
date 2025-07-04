import type { TravelPlanRequest, TravelPlanResponse, ApiError } from '../types/travel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class TravelService {
  async generateTravelPlan(request: TravelPlanRequest): Promise<TravelPlanResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/travel/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to generate travel plan');
      }

      const data: TravelPlanResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating travel plan:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/travel/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const travelService = new TravelService();