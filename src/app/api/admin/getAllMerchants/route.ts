import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/checkAdmin";
import dbConnect from "@/lib/db";
import Merchant from "@/models/Merchant";

export async function GET(req: NextRequest) {
  await dbConnect();
  const admin = await checkAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const merchants = await Merchant.find({ region: admin.region }).select(
    "-password"
  );
  return NextResponse.json(merchants);
}
