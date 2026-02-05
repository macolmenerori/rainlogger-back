import express from 'express';

import { protect } from '../controllers/authControllers';
import {
  addRainlogToDatabase,
  deleteRainlog,
  getRainlogById,
  getRainlogFilters,
  updateRainlog
} from '../controllers/rainlogControllers';
import { methodNotAllowed } from '../utils/methodNotAllowed';
import {
  addRainlogValidation,
  deleteRainlogValidation,
  getRainlogByIdValidation,
  getRainlogFiltersValidation,
  updateRainlogValidation
} from '../validations/rainlog.validations';

const router = express.Router();

router
  .route('/rainlog')
  .post(protect, addRainlogValidation, addRainlogToDatabase)
  .get(protect, getRainlogByIdValidation, getRainlogById)
  .put(protect, updateRainlogValidation, updateRainlog)
  .all(methodNotAllowed(['POST', 'GET', 'PUT']));

router
  .route('/rainlog/filters')
  .get(protect, getRainlogFiltersValidation, getRainlogFilters)
  .all(methodNotAllowed(['GET']));

router
  .route('/rainlog/delete/:id')
  .delete(protect, deleteRainlogValidation, deleteRainlog)
  .all(methodNotAllowed(['DELETE']));

export default router;
