import { NextRequest, NextResponse } from "next/server";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import Admin from "@/models/Admin";
import "@/lib/db"; // ensures DB connection is established

export async function GET(req: NextRequest) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  try {
    const Admins = await Admin.find().sort({ date: -1 });
    return NextResponse.json(Admins);
  } catch (error: unknown) {
    console.error((error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error in getting all Admins" },
      { status: 500 }
    );
  }
}
