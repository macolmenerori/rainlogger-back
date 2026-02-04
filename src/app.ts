import express, { Request, Response } from 'express';

import rainloggerRouter from './routes/rainloggerRouter';

const app = express();

// Healthcheck
app.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

app.use('api/v1/rainlogger', rainloggerRouter);

// Middleware for handling unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

export default app;
