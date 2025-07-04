# 🧪 Suite de Tests - Viajeros AI

Esta carpeta contiene una suite completa de tests para validar toda la funcionalidad de la aplicación de generación de planes de viaje.

## ⚡ Framework de Testing: Vitest Unificado

**Migrado completamente de Jest a Vitest** para unificar el testing entre frontend y backend:
- ✅ **Frontend**: Vitest + React Testing Library + jsdom
- ✅ **Backend**: Vitest + Supertest + Node.js environment  
- ✅ **Configuración**: Alias absolutos `@/` en ambos entornos
- ✅ **Performance**: Más rápido que Jest con Vite integration

## 📁 Estructura de Tests

```
tests/
├── README.md                          # Este archivo
├── setup.ts                           # Configuración global de tests frontend
├── sample.test.ts                      # Test de ejemplo
├── backend/                            # Tests del servidor Node.js
│   ├── unit/                          # Tests unitarios
│   │   ├── services/
│   │   │   ├── mockClaudeService.test.ts    # Tests del servicio mock
│   │   │   ├── aiServiceFactory.test.ts     # Tests del patrón Factory
│   │   │   └── claudeService.test.ts        # Tests del servicio real (futuro)
│   │   ├── controllers/
│   │   │   └── travelController.test.ts     # Tests del controlador principal
│   │   └── middleware/
│   │       └── validation.test.ts           # Tests de validación y sanitización
│   └── integration/                   # Tests de integración
│       ├── api.test.ts                     # Tests end-to-end de la API
│       └── health.test.ts                  # Tests de health checks
└── frontend/                          # Tests de React
    ├── components/
    │   ├── TravelForm.test.tsx             # Tests del formulario
    │   └── TravelPlanResult.test.tsx       # Tests de visualización
    └── services/
        └── travelService.test.ts           # Tests del cliente HTTP
```

## 🎯 Cobertura de Tests

### Backend Tests (Vitest + Supertest)

#### 🔧 Services Tests
- **MockClaudeService**: 
  - ✅ Validación de API key (siempre true)
  - ✅ Generación personalizada de planes
  - ✅ Latencia simulada (1-3 segundos)
  - ✅ Contenido adaptado por tipo de viaje
  - ✅ Información específica por destino
  - ✅ Tokens en rango realista (1000-3000)

- **AIServiceFactory**:
  - ✅ Patrón Singleton correctamente implementado
  - ✅ Switch automático mock/real según configuración
  - ✅ Manejo de errores para providers no implementados
  - ✅ Reset de instancia para testing

#### 🎮 Controllers Tests
- **TravelController**:
  - ✅ Generación exitosa de planes de viaje
  - ✅ Manejo de errores del servicio IA
  - ✅ Metadatos completos en respuesta
  - ✅ IDs únicos por request
  - ✅ Health checks funcionales

#### 🛡️ Middleware Tests
- **Validation**:
  - ✅ Validación de campos requeridos
  - ✅ Validación de tipos de viaje válidos
  - ✅ Validación de presupuestos válidos
  - ✅ Validación de rangos de días (1-365)
  - ✅ Sanitización de inputs (trim whitespace)
  - ✅ Campos opcionales manejados correctamente

#### 🔗 Integration Tests
- **API Endpoints**:
  - ✅ POST /api/travel/generate con datos válidos
  - ✅ Validación de errores 400 para datos inválidos
  - ✅ Manejo de diferentes tipos de viaje
  - ✅ Manejo de diferentes presupuestos
  - ✅ GET /api/travel/health funcionando
  - ✅ Manejo de errores 404 y métodos inválidos

- **Health Checks**:
  - ✅ Servicios de IA disponibles
  - ✅ Generación de planes funcional
  - ✅ Performance dentro de límites aceptables
  - ✅ Manejo de requests concurrentes
  - ✅ Uso de memoria controlado

### Frontend Tests (Vitest + React Testing Library)

#### 🎨 Components Tests
- **TravelForm**:
  - ✅ Renderizado de todos los campos
  - ✅ Valores por defecto correctos
  - ✅ Actualización de inputs por usuario
  - ✅ Envío de formulario con datos correctos
  - ✅ Validación de campos requeridos
  - ✅ Estados de loading funcionales
  - ✅ Opciones de select completas
  - ✅ Accesibilidad (labels, roles)

- **TravelPlanResult**:
  - ✅ Renderizado del plan de viaje
  - ✅ Metadatos mostrados correctamente
  - ✅ Botón de reset funcional
  - ✅ Formateo de contenido markdown
  - ✅ Manejo de contenido especial/vacío
  - ✅ Información de parámetros completa

#### 🌐 Services Tests
- **TravelService**:
  - ✅ Calls HTTP a endpoints correctos
  - ✅ Envío de datos estructurados
  - ✅ Manejo de respuestas exitosas
  - ✅ Manejo de errores de API
  - ✅ Manejo de errores de red
  - ✅ Health checks funcionales
  - ✅ Diferentes tipos y presupuestos
  - ✅ Configuración de URL desde environment

## 🚀 Ejecutar Tests

### Configuración Requerida

```bash
# Backend (desde /server)
npm install
npx vitest run

# Frontend (desde raíz)
npm install
npx vitest run
```

### Scripts Disponibles

```bash
# Tests individuales
npm run test:backend    # Solo tests del backend (Vitest)
npm run test:frontend   # Solo tests del frontend (Vitest)
npm run test:all        # Todos los tests unificados

# Con cobertura
npm run test:coverage   # Frontend con cobertura
cd server && npx vitest --coverage  # Backend con cobertura

# En modo watch
npx vitest --watch      # Modo watch para desarrollo
```

## 🎯 Casos de Prueba Principales

### Flujo End-to-End Testeado
1. **Usuario llena formulario** → Validación de inputs
2. **Envío a backend** → Llamada HTTP estructurada
3. **Validación en servidor** → Middleware de validación
4. **Generación con IA** → Mock service personalizado
5. **Respuesta al frontend** → Datos estructurados
6. **Visualización** → Renderizado correcto

### Escenarios de Error Cubiertos
- ❌ Campos requeridos faltantes
- ❌ Valores inválidos en selects
- ❌ Días fuera de rango (0 o >365)
- ❌ Errores de red/conectividad
- ❌ Respuestas malformadas de API
- ❌ Servicios de IA no disponibles

### Tipos de Viaje Testeados
- 👨‍👩‍👧‍👦 Familia (actividades para niños)
- 🎒 Mochilero (opciones económicas)
- 💎 Lujo (servicios premium)
- 🏔️ Aventura (deportes extremos)
- 🏛️ Cultural (museos, historia)
- 🍽️ Gastronómico (comida, restaurantes)

### Presupuestos Validados
- 💰 Bajo (hostales, transporte público)
- 💰💰 Medio (hoteles 3★, servicios estándar)
- 💰💰💰 Alto (lujo, servicios premium)

## 📊 Métricas de Testing

### Cobertura Esperada
- **Backend**: >90% líneas de código
- **Frontend**: >85% componentes y servicios
- **Integración**: 100% endpoints principales

### Performance Benchmarks
- **Mock Response**: <3 segundos
- **API Calls**: <5 segundos
- **Component Render**: <100ms
- **Form Validation**: Instantáneo

## 🔧 Configuración de CI/CD

Los tests están preparados para:
- ✅ GitHub Actions
- ✅ Ambiente de desarrollo local
- ✅ Builds automatizados
- ✅ Coverage reports
- ✅ Fallos de build en errores

## 📝 Notas para Desarrolladores

### Mantenimiento de Tests
1. **Actualizar tests** cuando se modifiquen componentes
2. **Añadir tests** para nuevas funcionalidades
3. **Mantener cobertura** > 80% en todo momento
4. **Validar integración** antes de commits

### Testing Best Practices Aplicadas
- 🎯 **AAA Pattern**: Arrange, Act, Assert
- 🔄 **Isolation**: Cada test independiente
- 📝 **Descriptive**: Nombres claros de tests
- 🚀 **Fast**: Ejecución rápida
- 🔍 **Deterministic**: Resultados consistentes
- 🛡️ **Edge Cases**: Casos límite cubiertos

### Debugging Tests
```bash
# Ejecutar test específico
npx vitest TravelForm.test.tsx

# Modo debug con logs
npx vitest --reporter=verbose

# Coverage detallado
npx vitest --coverage

# UI de testing
npx vitest --ui
```

¡Los tests están listos para validar toda la funcionalidad de Viajeros AI! 🎉