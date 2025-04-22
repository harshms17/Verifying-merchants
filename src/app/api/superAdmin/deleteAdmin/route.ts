import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";

export async function DELETE(
  req: Request
) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  const { id } = await req.json();

  if (!id)
    return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });

  try {
    await Admin.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
