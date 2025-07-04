import express from 'express';
import { TravelController } from '../controllers/travelController.js';
import { validateTravelPlan, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();
const travelController = new TravelController();

// Ruta para generar plan de viaje
router.post(
  '/generate',
  sanitizeInput,
  validateTravelPlan,
  travelController.generateTravelPlan.bind(travelController)
);

// Ruta de health check
router.get('/health', travelController.healthCheck.bind(travelController));

export { router as travelRouter };