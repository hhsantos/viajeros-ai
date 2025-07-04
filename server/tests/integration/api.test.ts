import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { travelRouter } from '@/routes/travel';

// Create test app
const createTestApp = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  app.use('/api/travel', travelRouter);
  
  return app;
};

describe('Travel API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
    
    // Set test environment variables
    process.env.USE_MOCK_AI = 'true';
    process.env.NODE_ENV = 'test';
  });

  describe('POST /api/travel/generate', () => {
    const validRequest = {
      origen: 'Madrid',
      destino: 'París',
      dias: 5,
      tipoViaje: 'familia',
      presupuesto: 'medio'
    };

    it('should generate a travel plan with valid data', async () => {
      const response = await request(app)
        .post('/api/travel/generate')
        .send(validRequest)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('plan');
      expect(response.body).toHaveProperty('metadata');
      
      expect(response.body.metadata).toHaveProperty('generatedAt');
      expect(response.body.metadata).toHaveProperty('aiProvider');
      expect(response.body.metadata).toHaveProperty('parametros');
      
      expect(response.body.metadata.aiProvider).toBe('Claude (Mock)');
      expect(response.body.metadata.parametros).toEqual(validRequest);
      expect(response.body.plan).toContain('Madrid');
      expect(response.body.plan).toContain('París');
    }, 10000); // Increase timeout for mock delay

    it('should return 400 for missing required fields', async () => {
      const invalidRequest = {
        origen: 'Madrid',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/travel/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return 400 for invalid field values', async () => {
      const invalidRequest = {
        ...validRequest,
        tipoViaje: 'invalid_type',
        presupuesto: 'invalid_budget'
      };

      const response = await request(app)
        .post('/api/travel/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.error).toBe('Validation error');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'tipoViaje'
          }),
          expect.objectContaining({
            field: 'presupuesto'
          })
        ])
      );
    });

    it('should handle different trip types correctly', async () => {
      const tripTypes = ['familia', 'mochilero', 'lujo', 'aventura', 'cultural', 'gastronomico'];
      
      for (const tipoViaje of tripTypes) {
        const response = await request(app)
          .post('/api/travel/generate')
          .send({ ...validRequest, tipoViaje })
          .expect(200);

        expect(response.body.plan).toContain(tipoViaje);
        expect(response.body.metadata.parametros.tipoViaje).toBe(tipoViaje);
      }
    }, 15000);

    it('should handle different budget levels correctly', async () => {
      const budgets = ['bajo', 'medio', 'alto'];
      
      for (const presupuesto of budgets) {
        const response = await request(app)
          .post('/api/travel/generate')
          .send({ ...validRequest, presupuesto })
          .expect(200);

        expect(response.body.plan).toContain(presupuesto);
        expect(response.body.metadata.parametros.presupuesto).toBe(presupuesto);
      }
    }, 10000);

    it('should sanitize input data', async () => {
      const requestWithWhitespace = {
        origen: '  Madrid  ',
        destino: '\n  París  \t',
        dias: 5,
        tipoViaje: '  familia  ',
        presupuesto: 'medio'
      };

      const response = await request(app)
        .post('/api/travel/generate')
        .send(requestWithWhitespace)
        .expect(200);

      expect(response.body.metadata.parametros.origen).toBe('Madrid');
      expect(response.body.metadata.parametros.destino).toBe('París');
      expect(response.body.metadata.parametros.tipoViaje).toBe('familia');
    }, 10000);

    it('should accept optional fields', async () => {
      const requestWithOptionals = {
        ...validRequest,
        alojamiento: 'hotel',
        transporte: 'vuelo',
        actividades: ['museos', 'parques']
      };

      const response = await request(app)
        .post('/api/travel/generate')
        .send(requestWithOptionals)
        .expect(200);

      expect(response.body.metadata.parametros.alojamiento).toBe('hotel');
      expect(response.body.metadata.parametros.transporte).toBe('vuelo');
      expect(response.body.metadata.parametros.actividades).toEqual(['museos', 'parques']);
    }, 10000);

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/api/travel/generate')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should enforce content type', async () => {
      const response = await request(app)
        .post('/api/travel/generate')
        .set('Content-Type', 'text/plain')
        .send('plain text')
        .expect(400);
    });
  });

  describe('GET /api/travel/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/travel/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('aiProvider', 'Claude (Mock)');
      expect(response.body).toHaveProperty('apiKeyValid', true);
      expect(response.body).toHaveProperty('timestamp');
      
      // Validate timestamp format
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should respond quickly to health checks', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/travel/health')
        .expect(200);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should respond in less than 1 second
    });
  });

  describe('Error handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/api/travel/nonexistent')
        .expect(404);
    });

    it('should handle invalid HTTP methods', async () => {
      await request(app)
        .put('/api/travel/generate')
        .expect(404);
        
      await request(app)
        .delete('/api/travel/health')
        .expect(404);
    });
  });
});