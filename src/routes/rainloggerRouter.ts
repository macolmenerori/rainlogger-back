import express from 'express';

import { protect } from '../controllers/authControllers';
import { addRainlogToDatabase } from '../controllers/rainlogControllers';
import { methodNotAllowed } from '../utils/methodNotAllowed';
import { addRainlogValidation } from '../validations/rainlog.validations';

const router = express.Router();

router

  .route('/rainlog')
  .post(protect, addRainlogValidation, addRainlogToDatabase)
  .all(methodNotAllowed(['POST']));

export default router;
