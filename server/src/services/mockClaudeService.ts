import { TravelPlanRequest, AIServiceResponse } from '../types/travel.js';
import { AIService } from './aiService.js';

export class MockClaudeService implements AIService {
  
  async validateApiKey(): Promise<boolean> {
    // Mock siempre retorna true para testing
    return true;
  }

  getProviderName(): string {
    return 'Claude (Mock)';
  }

  async generateTravelPlan(request: TravelPlanRequest): Promise<AIServiceResponse> {
    // Simular latencia de API real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockPlan = this.generateMockPlan(request);
    
    return {
      content: mockPlan,
      tokens_used: Math.floor(Math.random() * 2000) + 1000, // 1000-3000 tokens
      model: 'claude-3-sonnet-mock',
    };
  }

  private generateMockPlan(request: TravelPlanRequest): string {
    const { origen, destino, dias, tipoViaje, presupuesto } = request;
    
    return `# 🌍 Plan de Viaje: ${origen} ➡️ ${destino}

> ✈️ ${dias} días | Tipo: ${tipoViaje} | Presupuesto: ${presupuesto}

---

## 📋 Información Práctica

### ✅ Documentación
- **Pasaporte:** Vigente con mínimo 6 meses de validez
- **Visado:** ${this.getVisaInfo(destino)}
- **Seguros:** Recomendable seguro de viaje con cobertura médica

### 💉 Salud
- **Vacunas:** ${this.getVaccineInfo(destino)}
- **Medicamentos:** Llevar medicamentos habituales
- **Agua:** ${this.getWaterInfo(destino)}

### 💰 Moneda y Presupuesto
- **Moneda local:** ${this.getCurrency(destino)}
- **Cambio aproximado:** Consultar tipo de cambio actual
- **Presupuesto estimado:** ${this.getBudgetEstimate(dias, presupuesto)}

---

## 🗓️ Itinerario Detallado

${this.generateItinerary(dias, destino, tipoViaje)}

---

## 🏨 Alojamientos Recomendados

${this.getAccommodationRecommendations(destino, presupuesto, tipoViaje)}

---

## 🍽️ Gastronomía

${this.getFoodRecommendations(destino, tipoViaje)}

---

## 🎯 Actividades Principales

${this.getActivities(destino, tipoViaje, dias)}

---

## 💡 Consejos Útiles

${this.getTravelTips(destino, tipoViaje)}

---

## 📱 Información de Contacto

- **Emergencias locales:** ${this.getEmergencyInfo(destino)}
- **Embajada española:** Consultar dirección local
- **Apps útiles:** Google Translate, Maps.me, TripAdvisor

---

*✨ Plan generado para optimizar tu experiencia de viaje ${tipoViaje} con presupuesto ${presupuesto}*

**🤖 Generado por Claude (Mock Service) para testing - Viajeros AI**`;
  }

  private getVisaInfo(destino: string): string {
    const lowDest = destino.toLowerCase();
    if (lowDest.includes('japón') || lowDest.includes('japan')) {
      return 'No necesario hasta 90 días para turismo';
    }
    if (lowDest.includes('usa') || lowDest.includes('estados unidos')) {
      return 'ESTA requerido para estancias turísticas';
    }
    if (lowDest.includes('tailandia') || lowDest.includes('thailand')) {
      return 'No necesario hasta 30 días';
    }
    return 'Verificar requisitos según destino específico';
  }

  private getVaccineInfo(destino: string): string {
    const lowDest = destino.toLowerCase();
    if (lowDest.includes('tailandia') || lowDest.includes('vietnam') || lowDest.includes('camboya')) {
      return 'Hepatitis A/B, Tétanos, considerar Encefalitis Japonesa';
    }
    if (lowDest.includes('india') || lowDest.includes('bangladesh')) {
      return 'Hepatitis A/B, Fiebre Tifoidea, considerar Encefalitis Japonesa';
    }
    return 'Hepatitis A/B, Tétanos actualizados';
  }

  private getWaterInfo(destino: string): string {
    const lowDest = destino.toLowerCase();
    if (lowDest.includes('tailandia') || lowDest.includes('india') || lowDest.includes('vietnam')) {
      return 'Solo agua embotellada, evitar hielo';
    }
    return 'Preferible agua embotellada por precaución';
  }

  private getCurrency(destino: string): string {
    const lowDest = destino.toLowerCase();
    if (lowDest.includes('japón') || lowDest.includes('japan')) return 'Yen japonés (JPY)';
    if (lowDest.includes('tailandia') || lowDest.includes('thailand')) return 'Baht tailandés (THB)';
    if (lowDest.includes('usa') || lowDest.includes('estados unidos')) return 'Dólar estadounidense (USD)';
    if (lowDest.includes('vietnam')) return 'Dong vietnamita (VND)';
    if (lowDest.includes('francia') || lowDest.includes('paris')) return 'Euro (EUR)';
    return 'Consultar moneda local';
  }

  private getBudgetEstimate(dias: number, presupuesto: string): string {
    const multipliers = { bajo: 50, medio: 100, alto: 200 };
    const dailyBudget = multipliers[presupuesto as keyof typeof multipliers] || 100;
    const total = dailyBudget * dias;
    return `${dailyBudget}€/día aprox. - Total estimado: ${total}€`;
  }

  private generateItinerary(dias: number, destino: string, tipoViaje: string): string {
    let itinerary = '';
    for (let day = 1; day <= Math.min(dias, 7); day++) {
      itinerary += `### Día ${day}${day === 1 ? ' - Llegada' : day === dias ? ' - Salida' : ''}\n\n`;
      itinerary += this.getDayActivities(day, destino, tipoViaje);
      itinerary += '\n\n';
    }
    
    if (dias > 7) {
      itinerary += `### Días 8-${dias}\n\n`;
      itinerary += `Continuar explorando ${destino} siguiendo el patrón establecido. Considerar excursiones de día completo y tiempo libre para actividades espontáneas.\n\n`;
    }
    
    return itinerary;
  }

  private getDayActivities(day: number, destino: string, tipoViaje: string): string {
    const activities = {
      1: '- **Mañana:** Llegada y check-in al alojamiento\n- **Tarde:** Paseo de orientación por el centro\n- **Noche:** Cena en restaurante local recomendado',
      2: '- **Mañana:** Visita a principales atracciones históricas\n- **Tarde:** Museo o centro cultural\n- **Noche:** Experiencia gastronómica local',
      3: '- **Mañana:** Mercado local y compras de souvenirs\n- **Tarde:** Parque o zona verde para relajarse\n- **Noche:** Actividad nocturna típica de la zona',
    };
    
    if (tipoViaje === 'familia') {
      return activities[day as keyof typeof activities] || '- **Todo el día:** Actividades familiares adaptadas a niños\n- **Descansos:** Tiempo libre en el alojamiento';
    }
    
    if (tipoViaje === 'aventura') {
      return '- **Mañana:** Actividad de aventura (senderismo, deportes)\n- **Tarde:** Exploración de naturaleza\n- **Noche:** Descanso y planificación del siguiente día';
    }
    
    return activities[day as keyof typeof activities] || '- **Todo el día:** Exploración libre según intereses\n- **Flexibilidad:** Adaptarse a descubrimientos espontáneos';
  }

  private getAccommodationRecommendations(destino: string, presupuesto: string, tipoViaje: string): string {
    const budgetLevels = {
      bajo: '**Hostales y guesthouses** (15-30€/noche)\n- Habitaciones compartidas o privadas básicas\n- Ubicación céntrica\n- Desayuno incluido',
      medio: '**Hoteles 3-4 estrellas** (50-100€/noche)\n- Habitaciones privadas con baño\n- Servicios básicos incluidos\n- Ubicación conveniente',
      alto: '**Hoteles de lujo y resorts** (150-300€/noche)\n- Suites con servicios premium\n- Spa, piscina, restaurantes\n- Ubicaciones exclusivas'
    };
    
    let recommendations = budgetLevels[presupuesto as keyof typeof budgetLevels] || budgetLevels.medio;
    
    if (tipoViaje === 'familia') {
      recommendations += '\n\n**Consideraciones familiares:**\n- Habitaciones familiares o conectadas\n- Zona infantil o piscina\n- Servicios de niñera disponibles';
    }
    
    return recommendations;
  }

  private getFoodRecommendations(destino: string, tipoViaje: string): string {
    return `### 🥘 Platos Típicos
- **Especialidad 1:** Plato tradicional imperdible
- **Especialidad 2:** Postre o bebida típica local
- **Especialidad 3:** Street food recomendado

### 🍽️ Restaurantes Recomendados
- **Opción económica:** Mercado local con comida tradicional
- **Opción media:** Restaurante familiar con ambiente local
- **Opción premium:** Restaurante reconocido o con vista

### ⚠️ Consejos Alimentarios
- Probar la gastronomía local gradualmente
- Hidratarse constantemente
- ${tipoViaje === 'familia' ? 'Llevar snacks para niños' : 'Ser aventurero con nuevos sabores'}`;
  }

  private getActivities(destino: string, tipoViaje: string, dias: number): string {
    const baseActivities = [
      '🏛️ **Sitios históricos y monumentos**',
      '🎨 **Museos y galerías de arte**',
      '🌳 **Parques y espacios naturales**',
      '🛍️ **Mercados y zonas comerciales**',
      '🎭 **Espectáculos y eventos culturales**'
    ];
    
    const typeSpecific = {
      familia: ['🎢 **Parques temáticos**', '🐠 **Acuarios y zoológicos**', '🏖️ **Playas familiares**'],
      aventura: ['🏔️ **Senderismo y trekking**', '🚴 **Deportes extremos**', '🏕️ **Camping y naturaleza**'],
      cultural: ['📚 **Bibliotecas históricas**', '🎼 **Conciertos y ópera**', '🏛️ **Sitios UNESCO**'],
      gastronomico: ['👨‍🍳 **Clases de cocina**', '🍷 **Catas y degustaciones**', '🥘 **Food tours**'],
      lujo: ['💎 **Spas y wellness**', '🥂 **Experiencias VIP**', '🛥️ **Tours privados**'],
      mochilero: ['🎒 **Free walking tours**', '🏠 **Hostales con ambiente**', '🚌 **Transporte económico**']
    };
    
    const activities = [...baseActivities, ...(typeSpecific[tipoViaje as keyof typeof typeSpecific] || [])];
    
    return activities.join('\n') + `\n\n**⏰ Tiempo recomendado:** ${Math.min(dias, 10)} días permiten disfrutar sin prisas`;
  }

  private getTravelTips(destino: string, tipoViaje: string): string {
    return `### 🎒 Equipaje
- Ropa cómoda y apropiada para el clima
- Calzado cómodo para caminar
- ${tipoViaje === 'aventura' ? 'Equipo deportivo específico' : 'Ropa para ocasiones especiales'}

### 📱 Tecnología
- Adaptador de corriente universal
- Power bank para el móvil
- App de traducción offline

### 💡 Consejos Generales
- Llegar con mente abierta y flexible
- Respetar costumbres y tradiciones locales
- ${tipoViaje === 'familia' ? 'Planificar descansos frecuentes' : 'Interactuar con locales para experiencias auténticas'}
- Hacer copias de documentos importantes
- Informar itinerario a familiares

### 🚨 Seguridad
- Mantener documentos en lugar seguro
- No ostentar objetos de valor
- Conocer números de emergencia locales
- Confiar en el instinto ante situaciones dudosas`;
  }

  private getEmergencyInfo(destino: string): string {
    const lowDest = destino.toLowerCase();
    if (lowDest.includes('europa') || lowDest.includes('francia') || lowDest.includes('italia')) {
      return '112 (Emergencias generales)';
    }
    if (lowDest.includes('usa') || lowDest.includes('estados unidos')) {
      return '911 (Emergencias)';
    }
    if (lowDest.includes('japón') || lowDest.includes('japan')) {
      return '110 (Policía), 119 (Bomberos/Ambulancia)';
    }
    return 'Consultar números locales de emergencia';
  }
}