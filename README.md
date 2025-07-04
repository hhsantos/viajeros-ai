# 🌍 Viajeros - Generador de Planes de Viaje con IA

App en React para generar planes de viaje personalizados usando IA, adaptados a diferentes perfiles de viajeros y preferencias.

# 🚀 **PLAN DE DESARROLLO POR FASES**

## 📌 **FASE 1: MVP Básico (2-3 semanas)**
**Objetivo:** Generar planes básicos funcionales
- **Frontend:** Formulario simple con 5-6 campos esenciales
- **Backend:** Endpoint básico para llamar IA
- **IA:** Prompt simple, respuesta en markdown
- **Output:** Mostrar resultado en pantalla
- **Campos mínimos:** Origen, destino, días, tipo viaje, presupuesto

## 📌 **FASE 2: Mejora UX (2 semanas)**
**Objetivo:** Interfaz más profesional
- **Frontend:** Diseño mejorado, loading states
- **Validaciones:** Campos obligatorios, formatos
- **Exportación:** PDF básico
- **Guardado:** LocalStorage para no perder datos

## 📌 **FASE 3: Estructuración (2-3 semanas)**
**Objetivo:** Contenido más rico y organizado
- **Templates:** Prompts específicos por tipo viaje
- **Estructura:** JSON estructurado → Markdown
- **Mapas:** Integración Google Maps básica
- **Imágenes:** Placeholder o API gratuita

## 📌 **FASE 4: Persistencia (2 semanas)**
**Objetivo:** Guardar y recuperar planes
- **Backend:** Base de datos (PostgreSQL/MongoDB)
- **Autenticación:** Sistema básico (email/password)
- **CRUD:** Crear, leer, actualizar, eliminar planes
- **Compartir:** URLs públicas

## 📌 **FASE 5: Funcionalidades Avanzadas (3-4 semanas)**
- **Itinerarios:** Día a día detallado
- **Presupuestos:** Desglose por categorías
- **Colaboración:** Múltiples usuarios en un plan
- **Integración:** APIs de vuelos/hoteles (lectura)

## 📌 **FASE 6: Monetización (2-3 semanas)**
- **Freemium:** Límites en planes gratuitos
- **Pagos:** Stripe/PayPal
- **Analytics:** Métricas de uso
- **SEO:** Optimización para buscadores

---

## 🛠️ **Stack Tecnológico**
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js/Express
- **IA:** OpenAI API / Claude API
- **Base de datos:** PostgreSQL
- **Styling:** Tailwind CSS
- **Deploy:** Vercel (Frontend) + Railway (Backend)
