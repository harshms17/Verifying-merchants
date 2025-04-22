// app/api/merchant/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import connectToDB from '@/lib/db';
import Merchant from '@/models/Merchant';

// Zod validation schema for merchant registration
const merchantSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters long'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  shopName: z.string().min(3, 'Shop name must be at least 3 characters long'),
  shopImageUrl: z.string().url('Invalid shop image URL'),
  shopAddress: z.string().min(5, 'Shop address must be at least 5 characters long'),
  businessType: z.string().min(3, 'Business type must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  region: z.string().min(3, 'Region must be at least 3 characters long'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  socialMedia: z
    .object({
      facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
      instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    })
    .optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = merchantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const {
      name,
      email,
      password,
      phone,
      shopName,
      shopImageUrl,
      shopAddress,
      businessType,
      description,
      region,
      website,
      socialMedia,
    } = parsed.data;

    await connectToDB();

    // Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return NextResponse.json({ error: 'Merchant with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create merchant
    await Merchant.create({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      shopImageUrl,
      shopAddress,
      businessType,
      description,
      region: region.toUpperCase(),
      website: website || undefined,
      socialMedia: socialMedia || undefined,
      verified: false,
    });

    return NextResponse.json({ message: 'Merchant registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error in merchant registration:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error in registering merchant' },
      { status: 500 }
    );
  }
}
