import { validateTravelPlan, sanitizeInput } from '../../../../server/src/middleware/validation';
import type { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('validateTravelPlan', () => {
    it('should pass validation with valid data', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject missing required fields', () => {
      mockRequest.body = {
        origen: 'Madrid',
        // Missing destino, dias, tipoViaje, presupuesto
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'destino',
            message: expect.stringContaining('required')
          })
        ])
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid tipoViaje values', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'invalid_type',
        presupuesto: 'medio'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'tipoViaje',
            message: expect.stringContaining('must be one of')
          })
        ])
      });
    });

    it('should reject invalid presupuesto values', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'invalid_budget'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'presupuesto',
            message: expect.stringContaining('must be one of')
          })
        ])
      });
    });

    it('should reject days outside valid range', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 500, // Too many days
        tipoViaje: 'familia',
        presupuesto: 'medio'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'dias',
            message: expect.stringContaining('less than or equal to 365')
          })
        ])
      });
    });

    it('should reject string fields that are too short', () => {
      mockRequest.body = {
        origen: 'M', // Too short
        destino: 'P', // Too short
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'origen',
            message: expect.stringContaining('at least 2 characters')
          }),
          expect.objectContaining({
            field: 'destino',
            message: expect.stringContaining('at least 2 characters')
          })
        ])
      });
    });

    it('should accept valid optional fields', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio',
        alojamiento: 'hotel',
        transporte: 'vuelo',
        actividades: ['museos', 'parques']
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject invalid optional field values', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5,
        tipoViaje: 'familia',
        presupuesto: 'medio',
        alojamiento: 'invalid_accommodation',
        transporte: 'invalid_transport'
      };

      validateTravelPlan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'alojamiento',
            message: expect.stringContaining('must be one of')
          }),
          expect.objectContaining({
            field: 'transporte',
            message: expect.stringContaining('must be one of')
          })
        ])
      });
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace from string fields', () => {
      mockRequest.body = {
        origen: '  Madrid  ',
        destino: '\n  París  \t',
        dias: 5,
        tipoViaje: '  familia  ',
        presupuesto: 'medio'
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.origen).toBe('Madrid');
      expect(mockRequest.body.destino).toBe('París');
      expect(mockRequest.body.tipoViaje).toBe('familia');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not affect non-string fields', () => {
      mockRequest.body = {
        origen: 'Madrid',
        destino: 'París',
        dias: 5, // number
        tipoViaje: 'familia',
        presupuesto: 'medio',
        actividades: ['museo', 'parque'] // array
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.dias).toBe(5);
      expect(mockRequest.body.actividades).toEqual(['museo', 'parque']);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle undefined or null body', () => {
      mockRequest.body = undefined;

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle empty object', () => {
      mockRequest.body = {};

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});