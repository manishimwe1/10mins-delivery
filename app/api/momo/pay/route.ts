import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getAccessToken, sandboxHeaders } from "../utils/momoClient";

const MOMO_USER_ID = process.env.MOMO_USER_ID!;
const MOMO_API_KEY = process.env.MOMO_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, phone, externalId, payerMessage, payeeNote } =
      await req.json();

    const referenceId = uuidv4(); // unique transaction ID
    const accessToken = await getAccessToken(MOMO_USER_ID, MOMO_API_KEY);

    console.log({accessToken});
    await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      {
        amount: amount.toString(),
        currency,
        externalId,
        payer: { partyIdType: "MSISDN", partyId: phone },
        payerMessage,
        payeeNote,
      },
      { headers: sandboxHeaders(referenceId, accessToken) }
    );

    return NextResponse.json({ referenceId, message: "Payment request sent" });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Payment request failed", details: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
