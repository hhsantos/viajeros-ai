import { describe, it, expect, beforeEach } from 'vitest';
import { MockClaudeService } from '@/services/mockClaudeService';
import type { TravelPlanRequest } from '@/types/travel';

describe('MockClaudeService', () => {
  let mockService: MockClaudeService;

  beforeEach(() => {
    mockService = new MockClaudeService();
  });

  describe('validateApiKey', () => {
    it('should always return true for mock service', async () => {
      const result = await mockService.validateApiKey();
      expect(result).toBe(true);
    });
  });

  describe('getProviderName', () => {
    it('should return Claude (Mock)', () => {
      const result = mockService.getProviderName();
      expect(result).toBe('Claude (Mock)');
    });
  });

  describe('generateTravelPlan', () => {
    const mockRequest: TravelPlanRequest = {
      origen: 'Madrid',
      destino: 'París',
      dias: 5,
      tipoViaje: 'familia',
      presupuesto: 'medio'
    };

    it('should generate a travel plan with correct structure', async () => {
      const result = await mockService.generateTravelPlan(mockRequest);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokens_used');
      expect(result).toHaveProperty('model');
      expect(result.model).toBe('claude-3-sonnet-mock');
      expect(typeof result.content).toBe('string');
      expect(typeof result.tokens_used).toBe('number');
    });

    it('should personalize content based on input parameters', async () => {
      const result = await mockService.generateTravelPlan(mockRequest);

      expect(result.content).toContain('Madrid');
      expect(result.content).toContain('París');
      expect(result.content).toContain('5 días');
      expect(result.content).toContain('familia');
      expect(result.content).toContain('medio');
    });

    it('should generate different content for different destinations', async () => {
      const request1 = { ...mockRequest, destino: 'Japón' };
      const request2 = { ...mockRequest, destino: 'Tailandia' };

      const result1 = await mockService.generateTravelPlan(request1);
      const result2 = await mockService.generateTravelPlan(request2);

      expect(result1.content).toContain('Japón');
      expect(result2.content).toContain('Tailandia');
      expect(result1.content).not.toEqual(result2.content);
    });

    it('should adapt content based on trip type', async () => {
      const familyRequest = { ...mockRequest, tipoViaje: 'familia' as const };
      const adventureRequest = { ...mockRequest, tipoViaje: 'aventura' as const };

      const familyResult = await mockService.generateTravelPlan(familyRequest);
      const adventureResult = await mockService.generateTravelPlan(adventureRequest);

      expect(familyResult.content).toContain('familia');
      expect(adventureResult.content).toContain('aventura');
    });

    it('should include budget-specific recommendations', async () => {
      const lowBudgetRequest = { ...mockRequest, presupuesto: 'bajo' as const };
      const highBudgetRequest = { ...mockRequest, presupuesto: 'alto' as const };

      const lowResult = await mockService.generateTravelPlan(lowBudgetRequest);
      const highResult = await mockService.generateTravelPlan(highBudgetRequest);

      expect(lowResult.content).toContain('bajo');
      expect(highResult.content).toContain('alto');
    });

    it('should simulate realistic response time', async () => {
      const startTime = Date.now();
      await mockService.generateTravelPlan(mockRequest);
      const endTime = Date.now();

      const duration = endTime - startTime;
      expect(duration).toBeGreaterThan(1000); // At least 1 second
      expect(duration).toBeLessThan(3000); // Less than 3 seconds
    });

    it('should return tokens used within expected range', async () => {
      const result = await mockService.generateTravelPlan(mockRequest);

      expect(result.tokens_used).toBeGreaterThanOrEqual(1000);
      expect(result.tokens_used).toBeLessThanOrEqual(3000);
    });

    it('should generate comprehensive travel plan sections', async () => {
      const result = await mockService.generateTravelPlan(mockRequest);

      // Check for main sections
      expect(result.content).toContain('Información Práctica');
      expect(result.content).toContain('Itinerario Detallado');
      expect(result.content).toContain('Alojamientos Recomendados');
      expect(result.content).toContain('Gastronomía');
      expect(result.content).toContain('Actividades Principales');
      expect(result.content).toContain('Consejos Útiles');
    });
  });
});