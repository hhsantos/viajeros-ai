import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AIServiceFactory } from '../services/aiService.js';
import { TravelPlanRequest, TravelPlanResponse } from '../types/travel.js';

export class TravelController {
  async generateTravelPlan(req: Request, res: Response): Promise<void> {
    try {
      const request: TravelPlanRequest = req.body;
      
      // Obtener el servicio de IA
      const aiService = await AIServiceFactory.getInstance();
      
      // Generar el plan de viaje
      const aiResponse = await aiService.generateTravelPlan(request);
      
      // Crear la respuesta
      const response: TravelPlanResponse = {
        id: uuidv4(),
        plan: aiResponse.content,
        metadata: {
          generatedAt: new Date(),
          aiProvider: aiService.getProviderName(),
          parametros: request,
        },
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error generating travel plan:', error);
      
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate travel plan',
      });
    }
  }
  
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const aiService = await AIServiceFactory.getInstance();
      const isValid = await aiService.validateApiKey();
      
      res.status(200).json({
        status: 'healthy',
        aiProvider: aiService.getProviderName(),
        apiKeyValid: isValid,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: 'AI service unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  }
}