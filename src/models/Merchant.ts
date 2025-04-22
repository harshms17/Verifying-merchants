// src/models/Merchant.ts
import { Schema, Document, models, model } from 'mongoose';

export interface IMerchant extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  region: string;
  shopImageUrl: string;
  businessType: string;
  description: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verified: boolean;
  date?: Date;
}

const MerchantSchema: Schema<IMerchant> = new Schema<IMerchant>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  shopImageUrl: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Merchant = models.Merchant || model<IMerchant>('Merchant', MerchantSchema);
export default Merchant;
