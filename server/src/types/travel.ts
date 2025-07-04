export interface TravelPlanRequest {
  origen: string;
  destino: string;
  dias: number;
  tipoViaje: 'familia' | 'mochilero' | 'lujo' | 'aventura' | 'cultural' | 'gastronomico';
  presupuesto: 'bajo' | 'medio' | 'alto';
  alojamiento?: 'hotel' | 'hostal' | 'apartamento' | 'casa_rural';
  transporte?: 'vuelo' | 'tren' | 'autobus' | 'coche';
  actividades?: string[];
}

export interface TravelPlanResponse {
  id: string;
  plan: string;
  metadata: {
    generatedAt: Date;
    aiProvider: string;
    parametros: TravelPlanRequest;
  };
}

export interface AIServiceResponse {
  content: string;
  tokens_used?: number;
  model?: string;
}