import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/checkAdmin";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
  await dbConnect();
  const admin = await checkAdmin(req);
  if (admin instanceof NextResponse) return admin; // Unauthorized response

  return NextResponse.json({
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    region: admin.region,
    date: admin.date,
  });
}
