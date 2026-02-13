import mongoose, { Schema } from 'mongoose';

import { RainlogType } from './rainlogTypes';

const rainlogSchema: Schema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'A date must be provided']
  },
  records: {
    type: [String],
    required: false
  },
  measurement: {
    type: Number,
    required: [true, 'A measurement must be provided']
  },
  realReading: {
    type: Boolean,
    required: [true, 'Specify if this is a real reading or an estimated one'],
    default: true
  },
  location: {
    type: String,
    required: [true, 'A location must be provided']
  },
  timestamp: {
    type: Date,
    required: [true, 'A timestamp must be provided'],
    default: Date.now
  },
  loggedBy: {
    type: String,
    required: [true, 'A user must be provided']
  }
});

rainlogSchema.index({ date: 1, location: 1 }, { unique: true });

const RainlogModel = mongoose.model<RainlogType>('Rainlog', rainlogSchema);

export default RainlogModel;
