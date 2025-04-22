// app/api/merchant/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Merchant from "@/models/Merchant";

// Define Zod schema for merchant login
const merchantLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
}); 

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const parsedData = merchantLoginSchema.parse(await req.json());
    const { email, password } = parsedData;

    // Connect to MongoDB
    await dbConnect();

    // Find merchant by email
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Create JWT token
    const token = jwt.sign( { user: { id: merchant._id } }, process.env.JWT_SECRET!, { expiresIn: "7d" } );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Login error:", (error as Error).message);
    return NextResponse.json(
      { message: "Internal Server Error in logging in merchant" },
      { status: 500 }
    );
  }
}
