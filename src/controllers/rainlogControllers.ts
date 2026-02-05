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

export const getRainlogFilters = catchAsync(async (req: RequestRainlog, res: Response) => {
  const validation = checkValidation(req, res);
  if (validation !== undefined) {
    return validation;
  }

  const { date, dateFrom, dateTo, realReading, location, loggedBy } = req.query;

  if (!date && !dateFrom && !dateTo && realReading === undefined && !location && !loggedBy) {
    return res.status(400).json({
      status: 'fail',
      message: 'At least one filter query param must be provided'
    });
  }

  const filter: Record<string, unknown> = {};

  if (date) {
    filter.date = new Date(date as string);
  } else {
    const dateRange: Record<string, unknown> = {};
    if (dateFrom) dateRange.$gte = new Date(dateFrom as string);
    if (dateTo) dateRange.$lte = new Date(dateTo as string);
    if (Object.keys(dateRange).length > 0) filter.date = dateRange;
  }

  if (realReading !== undefined) filter.realReading = realReading as unknown as boolean;
  if (location) filter.location = location as string;
  if (loggedBy) filter.loggedBy = loggedBy as string;

  const rainlogs = await RainlogModel.find(filter);

  if (rainlogs.length === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'No rainlogs found matching the provided filters'
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      rainlogs
    }
  });
});
