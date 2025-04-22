import jwt from "jsonwebtoken";
import Merchant from "@/models/Merchant";
import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function getMerchantFromToken(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    
    await dbConnect();

    const merchant = await Merchant.findById(decoded.user.id);
    if (!merchant) {
      return NextResponse.json(
        { error: "Invalid token or merchant not found" },
        { status: 401 }
      );
    }

    return { id: merchant._id.toString() };

  } catch (err: any) {
    console.error("Token verification error:", err.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
