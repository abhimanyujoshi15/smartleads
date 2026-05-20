import { Schema, model, Document } from 'mongoose';

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost'
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral'
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required'],
    },
  },
  { 
    timestamps: true 
  }
);

// Indexing for optimal search performance
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = model<ILead>('Lead', leadSchema);