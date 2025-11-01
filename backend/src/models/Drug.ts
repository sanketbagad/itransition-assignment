import mongoose, { Schema, Document } from 'mongoose';

export interface IDrug extends Document {
  code: string;
  genericName: string;
  brandName: string;
  company: string;
  launchDate: Date;
}

const drugSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  genericName: {
    type: String,
    required: true,
    index: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
    index: true,
  },
  launchDate: {
    type: Date,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Create compound index for better query performance
drugSchema.index({ company: 1, launchDate: -1 });
drugSchema.index({ launchDate: -1 });

export const Drug = mongoose.model<IDrug>('Drug', drugSchema);