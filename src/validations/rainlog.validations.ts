import { body, query, ValidationChain } from 'express-validator';

export const addRainlogValidation: ValidationChain[] = [
  body('date')
    .exists()
    .withMessage('Date is required')
    .bail()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (2026-02-04)')
    .bail()
    .toDate()
    .withMessage('Date must be a valid date'),
  body('measurement')
    .exists()
    .withMessage('Measurement is required')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Measurement must be a positive number')
    .bail()
    .toFloat(),
  body('realReading')
    .exists()
    .withMessage('realReading is required')
    .bail()
    .isBoolean()
    .withMessage('realReading must be a boolean')
    .bail()
    .toBoolean(),
  body('location')
    .exists()
    .withMessage('Location is required')
    .bail()
    .isString()
    .withMessage('Location must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('Location cannot be empty')
];

export const getRainlogByIdValidation: ValidationChain[] = [
  query('id')
    .exists()
    .withMessage('ID is required')
    .bail()
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId')
];

export const getRainlogFiltersValidation: ValidationChain[] = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('date must be in ISO 8601 format (e.g. 2026-02-04)')
    .bail()
    .toDate()
    .custom((_value, { req }) => {
      if (req.query?.dateFrom || req.query?.dateTo) {
        throw new Error('date cannot be combined with dateFrom or dateTo');
      }
      return true;
    }),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('dateFrom must be in ISO 8601 format (e.g. 2026-02-04)')
    .bail()
    .toDate(),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('dateTo must be in ISO 8601 format (e.g. 2026-02-04)')
    .bail()
    .toDate(),
  query('realReading')
    .optional()
    .isBoolean()
    .withMessage('realReading must be a boolean')
    .bail()
    .toBoolean(),
  query('location')
    .optional()
    .isString()
    .withMessage('location must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('location cannot be empty'),
  query('loggedBy')
    .optional()
    .isString()
    .withMessage('loggedBy must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('loggedBy cannot be empty')
];
