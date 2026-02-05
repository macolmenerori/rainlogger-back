import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import RainlogModel from '../models/rainlogModel';
import catchAsync from '../utils/catchAsync';

import { RequestRainlog } from './authControllers';

/**
 * Checks if the validation has errors and sends a response if it does
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
const checkValidation = (req: RequestRainlog, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors: validationRes.array()
    });
  }
};

export const addRainlogToDatabase = catchAsync(async (req: RequestRainlog, res: Response) => {
  const validation = checkValidation(req, res);
  if (validation !== undefined) {
    return validation;
  }

  const newRainLog = await RainlogModel.create({
    date: req.body.date,
    measurement: req.body.measurement,
    realReading: req.body.realReading,
    location: req.body.location,
    timestamp: new Date(),
    loggedBy: req.user?.email
  });

  return res.status(201).json({
    status: 'success',
    message: 'Rainlog added successfully',
    data: {
      rainlog: newRainLog
    }
  });
});

export const getRainlogById = catchAsync(async (req: RequestRainlog, res: Response) => {
  const validation = checkValidation(req, res);
  if (validation !== undefined) {
    return validation;
  }

  const id = req.query.id as string;
  const rainlog = await RainlogModel.findById(id);

  if (!rainlog) {
    return res.status(404).json({
      status: 'fail',
      message: 'Rainlog not found'
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      rainlog
    }
  });
});
