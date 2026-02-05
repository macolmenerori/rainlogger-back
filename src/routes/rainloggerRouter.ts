import express from 'express';

import { protect } from '../controllers/authControllers';
import { addRainlogToDatabase, getRainlogById } from '../controllers/rainlogControllers';
import { methodNotAllowed } from '../utils/methodNotAllowed';
import { addRainlogValidation, getRainlogByIdValidation } from '../validations/rainlog.validations';

const router = express.Router();

router

  .route('/rainlog')
  .post(protect, addRainlogValidation, addRainlogToDatabase)
  .get(protect, getRainlogByIdValidation, getRainlogById)
  .all(methodNotAllowed(['POST', 'GET']));

export default router;
