import express from 'express';

import { protect } from '../controllers/authControllers';
import {
  addRainlogToDatabase,
  getRainlogById,
  getRainlogFilters
} from '../controllers/rainlogControllers';
import { methodNotAllowed } from '../utils/methodNotAllowed';
import {
  addRainlogValidation,
  getRainlogByIdValidation,
  getRainlogFiltersValidation
} from '../validations/rainlog.validations';

const router = express.Router();

router
  .route('/rainlog')
  .post(protect, addRainlogValidation, addRainlogToDatabase)
  .get(protect, getRainlogByIdValidation, getRainlogById)
  .all(methodNotAllowed(['POST', 'GET']));

router
  .route('/rainlog')
  .post(protect, addRainlogValidation, addRainlogToDatabase)
  .get(protect, getRainlogByIdValidation, getRainlogById)
  .all(methodNotAllowed(['POST', 'GET']));

router
  .route('/rainlog/filters')
  .get(protect, getRainlogFiltersValidation, getRainlogFilters)
  .all(methodNotAllowed(['GET']));

export default router;
