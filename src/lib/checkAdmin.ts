import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function checkAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await dbConnect();
    const admin = await Admin.findById(decoded.admin.id);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin not found" },
        { status: 401 }
      );
    }

    // Attach admin to request if needed (manually in handlers)
    return admin;
  } catch (error) {
    console.error("Admin check failed:", error);
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
