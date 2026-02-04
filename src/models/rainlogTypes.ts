import { HydratedDocument } from 'mongoose';

export type Rainlog = {
  date: Date;
  records?: string[];
  measurement: number;
  realReading: boolean;
  location: string;
  timestamp: Date;
  loggedBy: string;
};

export type RainlogType = HydratedDocument<Rainlog>;
