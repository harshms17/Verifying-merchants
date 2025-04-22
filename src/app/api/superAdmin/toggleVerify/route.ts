import { NextResponse } from "next/server";
import Merchant from "@/models/Merchant";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";

export async function PATCH(req: Request) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  const { id, verified } = await req.json();

  if (!id)
    return NextResponse.json({ error: "Merchant ID missing" }, { status: 400 });

  try {
    const updated = await Merchant.findByIdAndUpdate(
      id,
      { verified },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update verification" },
      { status: 500 }
    );
  }
}
