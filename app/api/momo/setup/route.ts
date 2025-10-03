import { NextResponse } from "next/server";
import { createApiUser, createApiKey, getApiUser } from "../utils/momoClient";

export async function GET() {
  try {
    // 1. Create API User
    const userId = await createApiUser();

    // 2. Verify user
    const userInfo = await getApiUser(userId);

    // 3. Create API Key
    const apiKey = await createApiKey(userId);

    return NextResponse.json({
      message: "Sandbox setup complete",
      userId,
      apiKey,
      userInfo,
    });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Setup failed", details: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
