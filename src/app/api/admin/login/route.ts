import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

// Zod schema for input validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    await dbConnect();

    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { admin: { id: admin._id } },
      process.env.JWT_SECRET!
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error during admin login" },
      { status: 500 }
    );
  }
}
