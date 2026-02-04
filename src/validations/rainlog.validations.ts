import { body, ValidationChain } from 'express-validator';

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
