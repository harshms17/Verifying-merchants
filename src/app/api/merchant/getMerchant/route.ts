import { NextRequest, NextResponse } from "next/server";
import Merchant from "@/models/Merchant";
import dbConnect from "@/lib/db";
import { getMerchantFromToken } from "@/lib/fetchMerchant";

export async function GET(req: NextRequest) {
  const userResult = await getMerchantFromToken(req);

  if ("status" in userResult) return userResult;

  try {
    await dbConnect();
    const merchant = await Merchant.findById(userResult.id).select(
      "-password -__v"
    );

    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant, { status: 200 });
  } catch (error: any) {
    console.error("Error in getMerchant route:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error in getting merchant" },
      { status: 500 }
    );
  }
}
