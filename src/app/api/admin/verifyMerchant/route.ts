import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/checkAdmin";
import dbConnect from "@/lib/db";
import Merchant from "@/models/Merchant";

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const admin = await checkAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id, verified } = await req.json();
    
    const merchant = await Merchant.findById(id);
    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    if (merchant.region !== admin.region) {
      return NextResponse.json(
        { error: "Forbidden: Region mismatch" },
        { status: 403 }
      );
    }

    merchant.verified = verified;
    await merchant.save();

    return NextResponse.json({ success: true, merchant });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
