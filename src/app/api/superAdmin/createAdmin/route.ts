import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";

export async function POST(req: Request) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  const { name, email, phone, region, password } = await req.json();

  if (!name || !email || !phone || !region || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 409 }
      );
    }

    const newAdmin = new Admin({ name, email, phone, region:region.toUpperCase(), password });
    await newAdmin.save();
    return NextResponse.json(newAdmin);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
