import { NextRequest, NextResponse } from "next/server";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import Merchant from "@/models/Merchant";
import "@/lib/db"; // Ensure DB is connected

export async function GET(req: NextRequest) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  try {
    const merchants = await Merchant.find({})
      .select("-password -__v")
      .sort({ createdAt: -1 });
    return NextResponse.json(merchants, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}