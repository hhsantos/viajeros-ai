import request from 'supertest';
import { AIServiceFactory } from '../../../server/src/services/aiService';

describe('Health Check Integration Tests', () => {
  beforeEach(() => {
    AIServiceFactory.resetInstance();
    process.env.USE_MOCK_AI = 'true';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    AIServiceFactory.resetInstance();
  });

  describe('AI Service Health', () => {
    it('should validate mock AI service is working', async () => {
      const service = await AIServiceFactory.getInstance();
      
      expect(service.getProviderName()).toBe('Claude (Mock)');
      expect(await service.validateApiKey()).toBe(true);
    });

    it('should generate travel plans in health check context', async () => {
      const service = await AIServiceFactory.getInstance();
      
      const request = {
        origen: 'Test Origin',
        destino: 'Test Destination',
        dias: 3,
        tipoViaje: 'familia' as const,
        presupuesto: 'medio' as const
      };

      const result = await service.generateTravelPlan(request);
      
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokens_used');
      expect(result).toHaveProperty('model');
      expect(result.content).toContain('Test Origin');
      expect(result.content).toContain('Test Destination');
    });

    it('should handle service factory initialization', async () => {
      // Test multiple initializations
      const service1 = await AIServiceFactory.getInstance();
      const service2 = await AIServiceFactory.getInstance();
      
      expect(service1).toBe(service2); // Should be singleton
      
      AIServiceFactory.resetInstance();
      
      const service3 = await AIServiceFactory.getInstance();
      expect(service3).not.toBe(service1); // Should be new instance after reset
    });

    it('should handle different environment configurations', async () => {
      // Test with mock enabled
      process.env.USE_MOCK_AI = 'true';
      AIServiceFactory.resetInstance();
      
      const mockService = await AIServiceFactory.getInstance();
      expect(mockService.getProviderName()).toBe('Claude (Mock)');
      
      // Test with missing API key (should default to mock)
      delete process.env.CLAUDE_API_KEY;
      process.env.USE_MOCK_AI = 'false';
      AIServiceFactory.resetInstance();
      
      const defaultMockService = await AIServiceFactory.getInstance();
      expect(defaultMockService.getProviderName()).toBe('Claude (Mock)');
    });

    it('should maintain consistent response format', async () => {
      const service = await AIServiceFactory.getInstance();
      
      const request = {
        origen: 'Madrid',
        destino: 'Barcelona',
        dias: 2,
        tipoViaje: 'cultural' as const,
        presupuesto: 'alto' as const
      };

      const result = await service.generateTravelPlan(request);
      
      // Validate response structure
      expect(typeof result.content).toBe('string');
      expect(typeof result.tokens_used).toBe('number');
      expect(typeof result.model).toBe('string');
      
      // Validate content structure
      expect(result.content).toMatch(/^#.*Plan de Viaje/); // Should start with title
      expect(result.content).toContain('Madrid → Barcelona'); // Should contain route
      expect(result.content).toContain('Información Práctica'); // Should have sections
      
      // Validate tokens range
      expect(result.tokens_used).toBeGreaterThan(0);
      expect(result.tokens_used).toBeLessThan(10000);
    });

    it('should handle service errors gracefully', async () => {
      // Test with invalid provider
      process.env.AI_PROVIDER = 'invalid_provider';
      AIServiceFactory.resetInstance();
      
      await expect(AIServiceFactory.getInstance()).rejects.toThrow('Unknown AI provider');
      
      // Reset to valid state
      process.env.AI_PROVIDER = 'claude';
      process.env.USE_MOCK_AI = 'true';
      AIServiceFactory.resetInstance();
    });
  });

  describe('Performance Health Checks', () => {
    it('should respond within acceptable time limits', async () => {
      const service = await AIServiceFactory.getInstance();
      
      const request = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia' as const,
        presupuesto: 'medio' as const
      };

      const startTime = Date.now();
      await service.generateTravelPlan(request);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent requests', async () => {
      const service = await AIServiceFactory.getInstance();
      
      const request = {
        origen: 'Test',
        destino: 'Test',
        dias: 1,
        tipoViaje: 'familia' as const,
        presupuesto: 'medio' as const
      };

      // Make multiple concurrent requests
      const promises = Array(5).fill(null).map(() => 
        service.generateTravelPlan(request)
      );

      const results = await Promise.all(promises);
      
      // All should succeed
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('tokens_used');
        expect(result).toHaveProperty('model');
      });
    }, 10000);

    it('should maintain memory usage within bounds', async () => {
      const service = await AIServiceFactory.getInstance();
      
      const request = {
        origen: 'Test',
        destino: 'Test',
        dias: 1,
        tipoViaje: 'familia' as const,
        presupuesto: 'medio' as const
      };

      const initialMemory = process.memoryUsage();
      
      // Generate multiple plans
      for (let i = 0; i < 10; i++) {
        await service.generateTravelPlan(request);
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }, 15000);
  });
});