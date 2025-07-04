import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const travelPlanSchema = Joi.object({
  origen: Joi.string().required().min(2).max(100),
  destino: Joi.string().required().min(2).max(100),
  dias: Joi.number().integer().min(1).max(365).required(),
  tipoViaje: Joi.string().valid('familia', 'mochilero', 'lujo', 'aventura', 'cultural', 'gastronomico').required(),
  presupuesto: Joi.string().valid('bajo', 'medio', 'alto').required(),
  alojamiento: Joi.string().valid('hotel', 'hostal', 'apartamento', 'casa_rural').optional(),
  transporte: Joi.string().valid('vuelo', 'tren', 'autobus', 'coche').optional(),
  actividades: Joi.array().items(Joi.string()).optional(),
});

export const validateTravelPlan = (req: Request, res: Response, next: NextFunction) => {
  const { error } = travelPlanSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }
  
  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};