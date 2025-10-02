import { NextResponse } from "next/server";
import axios from "axios";
import { getAccessToken, sandboxHeaders } from "../utils/momoClient";

const MOMO_USER_ID = process.env.MOMO_USER_ID!;
const MOMO_API_KEY = process.env.MOMO_API_KEY!;

export async function GET() {
  try {
    const accessToken = await getAccessToken(MOMO_USER_ID, MOMO_API_KEY);

    const res = await axios.get(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance",
      { headers: sandboxHeaders(undefined, accessToken, false) }
    );

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to fetch balance", details: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
