import Anthropic from '@anthropic-ai/sdk';
import { TravelPlanRequest, AIServiceResponse } from '../types/travel.js';
import { AIService } from './aiService.js';

export class ClaudeService implements AIService {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is required');
    }
    
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  getProviderName(): string {
    return 'Claude';
  }

  async generateTravelPlan(request: TravelPlanRequest): Promise<AIServiceResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude');
      }

      return {
        content: content.text,
        tokens_used: response.usage.input_tokens + response.usage.output_tokens,
        model: response.model,
      };
    } catch (error) {
      console.error('Error generating travel plan with Claude:', error);
      throw new Error('Failed to generate travel plan');
    }
  }

  private buildPrompt(request: TravelPlanRequest): string {
    const { origen, destino, dias, tipoViaje, presupuesto, alojamiento, transporte } = request;
    
    return `
Eres un experto en planificación de viajes. Genera un plan de viaje detallado en formato Markdown con la siguiente información:

**Parámetros del viaje:**
- Origen: ${origen}
- Destino: ${destino}
- Duración: ${dias} días
- Tipo de viaje: ${tipoViaje}
- Presupuesto: ${presupuesto}
- Alojamiento preferido: ${alojamiento || 'flexible'}
- Transporte preferido: ${transporte || 'flexible'}

**Estructura requerida:**
1. # Título del viaje
2. ## Información práctica (visados, vacunas, moneda, clima)
3. ## Itinerario por días
4. ## Alojamientos recomendados
5. ## Comida y restaurantes
6. ## Actividades principales
7. ## Presupuesto estimado
8. ## Consejos útiles

**Consideraciones importantes:**
- Adapta el contenido al tipo de viaje seleccionado
- Incluye precios aproximados según el presupuesto
- Sugiere actividades apropiadas para el perfil
- Menciona aspectos de seguridad relevantes
- Incluye enlaces útiles cuando sea apropiado

Genera un plan completo y detallado que sea útil y práctico para el viajero.
`.trim();
  }
}