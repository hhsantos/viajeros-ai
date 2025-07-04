import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TravelController } from '@/controllers/travelController';
import { AIServiceFactory } from '@/services/aiService';
import type { Request, Response } from 'express';
import type { TravelPlanRequest } from '@/types/travel';

// Mock the AIServiceFactory
vi.mock('@/services/aiService');

describe('TravelController', () => {
  let controller: TravelController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAIService: any;

  beforeEach(() => {
    controller = new TravelController();
    
    mockRequest = {
      body: {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio'
      } as TravelPlanRequest
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    mockAIService = {
      generateTravelPlan: vi.fn(),
      validateApiKey: vi.fn(),
      getProviderName: vi.fn()
    };

    (AIServiceFactory.getInstance as any).mockResolvedValue(mockAIService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateTravelPlan', () => {
    it('should generate a travel plan successfully', async () => {
      const mockAIResponse = {
        content: 'Mock travel plan content',
        tokens_used: 1500,
        model: 'claude-3-sonnet-mock'
      };

      mockAIService.generateTravelPlan.mockResolvedValue(mockAIResponse);

      await controller.generateTravelPlan(mockRequest as Request, mockResponse as Response);

      expect(mockAIService.generateTravelPlan).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          plan: 'Mock travel plan content',
          metadata: expect.objectContaining({
            generatedAt: expect.any(Date),
            aiProvider: expect.any(String),
            parametros: mockRequest.body
          })
        })
      );
    });

    it('should handle AI service errors', async () => {
      mockAIService.generateTravelPlan.mockRejectedValue(new Error('AI service error'));

      await controller.generateTravelPlan(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        message: 'Failed to generate travel plan'
      });
    });

    it('should include all required metadata in response', async () => {
      const mockAIResponse = {
        content: 'Mock content',
        tokens_used: 1500,
        model: 'test-model'
      };

      mockAIService.generateTravelPlan.mockResolvedValue(mockAIResponse);
      mockAIService.getProviderName.mockReturnValue('Test Provider');

      await controller.generateTravelPlan(mockRequest as Request, mockResponse as Response);

      const responseCall = (mockResponse.json as any).mock.calls[0][0];
      
      expect(responseCall.metadata).toEqual({
        generatedAt: expect.any(Date),
        aiProvider: 'Test Provider',
        parametros: mockRequest.body
      });
    });

    it('should generate unique IDs for each request', async () => {
      const mockAIResponse = {
        content: 'Mock content',
        tokens_used: 1500,
        model: 'test-model'
      };

      mockAIService.generateTravelPlan.mockResolvedValue(mockAIResponse);

      await controller.generateTravelPlan(mockRequest as Request, mockResponse as Response);
      const response1 = (mockResponse.json as any).mock.calls[0][0];

      // Reset mocks and call again
      vi.clearAllMocks();
      mockAIService.generateTravelPlan.mockResolvedValue(mockAIResponse);
      (AIServiceFactory.getInstance as any).mockResolvedValue(mockAIService);

      await controller.generateTravelPlan(mockRequest as Request, mockResponse as Response);
      const response2 = (mockResponse.json as any).mock.calls[0][0];

      expect(response1.id).not.toEqual(response2.id);
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when AI service is valid', async () => {
      mockAIService.validateApiKey.mockResolvedValue(true);
      mockAIService.getProviderName.mockReturnValue('Test Provider');

      await controller.healthCheck(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'healthy',
        aiProvider: 'Test Provider',
        apiKeyValid: true,
        timestamp: expect.any(String)
      });
    });

    it('should return unhealthy status when AI service throws error', async () => {
      (AIServiceFactory.getInstance as any).mockRejectedValue(new Error('Service unavailable'));

      await controller.healthCheck(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'unhealthy',
        error: 'AI service unavailable',
        timestamp: expect.any(String)
      });
    });

    it('should handle API key validation failure', async () => {
      mockAIService.validateApiKey.mockResolvedValue(false);
      mockAIService.getProviderName.mockReturnValue('Test Provider');

      await controller.healthCheck(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
          apiKeyValid: false
        })
      );
    });
  });
});