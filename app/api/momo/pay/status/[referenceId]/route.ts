import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAccessToken } from "../../../utils/momoClient";
 
const MOMO_USER_ID = process.env.MOMO_USER_ID!;
const MOMO_API_KEY = process.env.MOMO_API_KEY!;
const MOMO_SUB_KEY = process.env.MOMO_SUB_KEY!;
const MOMO_ENV = process.env.MOMO_ENV || "sandbox";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ referenceId: string }> } // 👈 params is async
) {
  try {
    const { referenceId } = await context.params; // ✅ await it

    const accessToken = await getAccessToken(MOMO_USER_ID, MOMO_API_KEY);

    const res = await axios.get(
      `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": MOMO_SUB_KEY,
          "X-Target-Environment": MOMO_ENV,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    console.error("Error checking payment status:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to check payment status" },
      { status: error.response?.status || 500 }
    );
  }
}
