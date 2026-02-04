import compression from 'compression';
import express, { Request, Response } from 'express';

import rainloggerRouter from './routes/rainloggerRouter';

const app = express();

// Middleware, modifies incoming data. For parsing JSON bodies on POST requests
app.use(express.json({ limit: '1024kb' })); // Do not accept bodies bigger than 1 megabyte

// Middleware, modifies incoming data. For parsing URL encoded forms
app.use(express.urlencoded({ extended: false, limit: '10kb' })); // Do not accept bodies bigger than 10 kilobytes

// Compress responses
app.use(compression());

// Healthcheck
app.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

app.use('/api/v1/rainlogger', rainloggerRouter);

// Middleware for handling unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

export default app;
