# 📚 Documentación Técnica - Viajeros AI

## 🏗️ Arquitectura del Sistema

### Patrón de Arquitectura
- **Tipo:** Cliente-Servidor con API REST
- **Frontend:** SPA (Single Page Application) React
- **Backend:** API REST Node.js/Express
- **Comunicación:** HTTP/JSON entre cliente y servidor

### Principios Aplicados
- **Separación de responsabilidades:** Frontend UI, Backend lógica de negocio
- **Desacoplamiento:** Factory pattern para proveedores de IA
- **Inversión de dependencias:** Interfaces abstractas para servicios
- **Single Responsibility:** Cada módulo tiene una función específica

---

## 🔧 Configuración de Desarrollo

### Alias Absolutos (`@`)
```typescript
// tsconfig.json - Frontend y Backend
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Ejemplos de uso:
import { TravelForm } from '@/components/TravelForm';          // Frontend
import { AIServiceFactory } from '@/services/aiService';      // Backend
import { validateTravelPlan } from '@/middleware/validation';  // Backend
```

### Configuración Vitest Unificada
```typescript
// vitest.config.ts - Frontend
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  test: {
    environment: 'jsdom',          // Para tests React
    include: ['tests/frontend/**/*.{test,spec}.{ts,tsx}']
  }
});

// server/vitest.config.ts - Backend  
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  test: {
    environment: 'node',           // Para tests Node.js
    include: ['tests/**/*.{test,spec}.{ts,tsx}']
  }
});
```

---

## 🎯 API Endpoints

### POST `/api/travel/generate`
**Descripción:** Genera un plan de viaje personalizado

**Request Body:**
```typescript
interface TravelPlanRequest {
  origen: string;              // Origen del viaje (min 2 chars)
  destino: string;             // Destino del viaje (min 2 chars)  
  dias: number;                // Número de días (1-365)
  tipoViaje: 'familia' | 'mochilero' | 'lujo' | 'aventura' | 'cultural' | 'gastronomico';
  presupuesto: 'bajo' | 'medio' | 'alto';
  alojamiento?: 'hotel' | 'hostal' | 'apartamento' | 'casa_rural';
  transporte?: 'vuelo' | 'tren' | 'autobus' | 'coche';
  actividades?: string[];      // Array de actividades preferidas
}
```

**Response:**
```typescript
interface TravelPlanResponse {
  id: string;                  // UUID único del plan
  plan: string;                // Plan en formato markdown
  metadata: {
    generatedAt: Date;         // Timestamp de generación
    aiProvider: string;        // Proveedor de IA utilizado
    parametros: TravelPlanRequest; // Parámetros originales
  };
}
```

**Códigos de respuesta:**
- `200`: Plan generado exitosamente
- `400`: Error de validación en los datos
- `500`: Error interno del servidor

### GET `/api/travel/health`
**Descripción:** Health check del servicio

**Response:**
```typescript
{
  status: 'healthy' | 'unhealthy';
  aiProvider: string;
  apiKeyValid: boolean;
  timestamp: string;
}
```

---

## 🧠 Servicios de IA

### Factory Pattern
```typescript
// AIServiceFactory - Patrón Factory
class AIServiceFactory {
  private static instance: AIService | null = null;

  static async getInstance(): Promise<AIService> {
    if (!this.instance) {
      const provider = process.env.AI_PROVIDER || 'claude';
      const useMock = process.env.USE_MOCK_AI === 'true';
      
      if (useMock || !process.env.CLAUDE_API_KEY) {
        this.instance = new MockClaudeService();
      } else {
        switch (provider) {
          case 'claude':
            this.instance = new ClaudeService();
            break;
          default:
            throw new Error(`Unknown AI provider: ${provider}`);
        }
      }
    }
    return this.instance;
  }
}
```

### Interfaz de Servicio
```typescript
interface AIService {
  generateTravelPlan(request: TravelPlanRequest): Promise<AIResponse>;
  validateApiKey(): Promise<boolean>;
  getProviderName(): string;
}
```

### MockClaudeService
- **Propósito:** Desarrollo sin costos de API
- **Comportamiento:** Simula respuestas realistas con delay de 1.5s
- **Personalización:** Incluye datos del request en la respuesta
- **Tokens:** Genera números aleatorios entre 1000-3000

---

## 🛡️ Middleware de Seguridad

### Validación con Joi
```typescript
const travelPlanSchema = Joi.object({
  origen: Joi.string().min(2).max(100).required(),
  destino: Joi.string().min(2).max(100).required(),
  dias: Joi.number().integer().min(1).max(365).required(),
  tipoViaje: Joi.string().valid('familia', 'mochilero', 'lujo', 'aventura', 'cultural', 'gastronomico').required(),
  presupuesto: Joi.string().valid('bajo', 'medio', 'alto').required(),
  alojamiento: Joi.string().valid('hotel', 'hostal', 'apartamento', 'casa_rural').optional(),
  transporte: Joi.string().valid('vuelo', 'tren', 'autobus', 'coche').optional(),
  actividades: Joi.array().items(Joi.string()).optional()
});
```

### Sanitización de Datos
```typescript
function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
}
```

### Headers de Seguridad
- **Helmet:** Headers de seguridad HTTP
- **CORS:** Configurado para frontend específico
- **Rate Limiting:** 100 requests por 15 minutos

---

## 🧪 Testing Strategy

### Testing Pyramid
```
        /\
       /  \     E2E Tests (Por implementar)
      /____\    
     /      \   Integration Tests
    /________\  
   /          \ Unit Tests
  /__________\ 
```

### Tests Unitarios (67% del total)
- **Servicios:** MockClaudeService, AIServiceFactory
- **Controladores:** TravelController 
- **Middleware:** Validación, sanitización
- **Componentes:** TravelForm, TravelPlanResult

### Tests de Integración (33% del total)
- **API Endpoints:** POST /generate, GET /health
- **Health Checks:** Validación de servicios
- **Performance:** Timeouts y memory usage

### Configuración Vitest
```typescript
// Mocking con Vitest
vi.mock('@/services/aiService');
const mockAIService = {
  generateTravelPlan: vi.fn(),
  validateApiKey: vi.fn(),
  getProviderName: vi.fn()
};
```

---

## 📁 Estructura de Directorios

```
viajeros/
├── src/                           # Frontend React
│   ├── components/
│   │   ├── TravelForm.tsx         # Formulario principal
│   │   └── TravelPlanResult.tsx   # Visualización resultado
│   ├── services/
│   │   └── travelService.ts       # Cliente API REST
│   ├── types/
│   │   └── travel.ts              # Tipos TypeScript compartidos
│   ├── App.tsx                    # Componente raíz
│   └── index.css                  # Estilos globales
├── server/                        # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   │   └── travelController.ts # Lógica de endpoints
│   │   ├── middleware/
│   │   │   ├── validation.ts       # Validación Joi
│   │   │   └── security.ts         # Headers seguridad
│   │   ├── routes/
│   │   │   └── travel.ts           # Definición rutas Express
│   │   ├── services/
│   │   │   ├── aiService.ts        # Factory pattern
│   │   │   ├── claudeService.ts    # Implementación Claude
│   │   │   └── mockClaudeService.ts # Mock para desarrollo
│   │   ├── types/
│   │   │   └── travel.ts           # Tipos compartidos backend
│   │   └── index.ts               # Entry point servidor
│   ├── tests/                     # Tests backend
│   │   ├── integration/           # Tests API
│   │   └── unit/                  # Tests unitarios
│   ├── vitest.config.ts           # Config Vitest backend
│   └── vitest.setup.ts            # Setup tests
├── tests/                         # Tests frontend
│   ├── frontend/
│   │   ├── components/            # Tests componentes React
│   │   └── services/              # Tests servicios
│   └── frontend/setup.ts          # Setup Vitest frontend
├── vitest.config.ts               # Config Vitest frontend
├── vite.config.ts                 # Config Vite
├── tsconfig.app.json              # Config TypeScript app
└── README.md                      # Documentación usuario
```

---

## 🔄 Flujo de Datos

### 1. Request Flow
```
Usuario → TravelForm → travelService → API → Validation → Controller → AIService → Response
```

### 2. Response Flow  
```
AIService → Controller → API → travelService → TravelPlanResult → Usuario
```

### 3. Error Handling
```
Error → Middleware → Controller → Formatted Response → Frontend → User Feedback
```

---

## 🌐 Variables de Entorno

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001   # URL del backend
```

### Backend (.env)
```bash
# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de IA
AI_PROVIDER=claude
USE_MOCK_AI=true                     # true para desarrollo sin costos
CLAUDE_API_KEY=sk-ant-api03-...      # API key real de Claude

# Configuración de seguridad
CORS_ORIGIN=http://localhost:5173   # URL del frontend
RATE_LIMIT_WINDOW_MS=900000         # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100         # 100 requests por ventana
```

---

## 🚀 Scripts de Desarrollo

### Frontend
```bash
npm run dev              # Servidor desarrollo (Vite)
npm run build            # Build producción
npm run preview          # Preview build
npm run test             # Tests con Vitest
npm run test:ui          # UI de tests
npm run test:coverage    # Coverage report
npm run lint             # ESLint
```

### Backend
```bash
npm run dev              # Servidor desarrollo (nodemon)
npm run build            # Compilar TypeScript
npm run start            # Ejecutar build
npm run test             # Tests con Vitest
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Coverage report
npm run lint             # ESLint
```

### Proyecto Completo
```bash
npm run test:all         # Todos los tests (frontend + backend)
npm run test:frontend    # Solo tests frontend
npm run test:backend     # Solo tests backend
```

---

## 📊 Métricas de Calidad

### Cobertura de Tests
- **Total Tests:** 104
- **Success Rate:** 89%
- **Types Coverage:** 100% (TypeScript strict)
- **Linting:** 0 errores ESLint

### Performance
- **Frontend Build:** < 2s (Vite)
- **Backend Startup:** < 1s
- **API Response:** < 2s (mock), < 10s (Claude real)
- **Test Suite:** < 30s completa

### Code Quality
- **TypeScript:** Strict mode habilitado
- **ESLint:** Configuración estricta
- **Imports:** Alias absolutos para legibilidad
- **Git:** Commits descriptivos y versionado semántico

---

*📖 Documentación técnica mantenida al día con el desarrollo del proyecto*