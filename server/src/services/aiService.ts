import { TravelPlanRequest, AIServiceResponse } from '../types/travel.js';

export interface AIService {
  generateTravelPlan(request: TravelPlanRequest): Promise<AIServiceResponse>;
  validateApiKey(): Promise<boolean>;
  getProviderName(): string;
}

export class AIServiceFactory {
  private static instance: AIService | null = null;

  static async getInstance(): Promise<AIService> {
    if (!this.instance) {
      const provider = process.env.AI_PROVIDER || 'claude';
      const useMock = process.env.USE_MOCK_AI === 'true' || !process.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY === 'sk-ant-api03-tu_clave_aqui';
      
      switch (provider.toLowerCase()) {
        case 'claude':
          if (useMock) {
            const { MockClaudeService } = await import('./mockClaudeService.js');
            this.instance = new MockClaudeService();
          } else {
            const { ClaudeService } = await import('./claudeService.js');
            this.instance = new ClaudeService();
          }
          break;
        case 'openai':
          // Implementar más adelante
          throw new Error('OpenAI service not implemented yet');
        default:
          throw new Error(`Unknown AI provider: ${provider}`);
      }
    }
    
    return this.instance!;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}