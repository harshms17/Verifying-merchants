// src/api/totalMerchants/route.ts
import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/lib/db';
import Merchant from '@/models/Merchant';

export async function GET(req: NextRequest) {
  try {
    await connectToDB(); // Connect to MongoDB
    const totalMerchants = await Merchant.countDocuments({});
    return NextResponse.json({ totalMerchants });
  } catch (error) {
    console.error('Error fetching Merchant counts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in getting Merchant counts' },
      { status: 500 }
    );
  }
}
