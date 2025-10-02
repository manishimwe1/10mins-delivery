import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const MOMO_SUB_KEY = process.env.MOMO_SUB_KEY!;
const MOMO_ENV = process.env.MOMO_ENV || "sandbox";
const CALLBACK_HOST = process.env.MOMO_CALLBACK_HOST || "https://yourdomain.com/api/momo/webhook" //TODO:make this webhook endpoint;

// ========== HELPERS ==========
export const sandboxHeaders = (
  referenceId?: string,
  accessToken?: string,
  isJson: boolean = true
) => {
  const headers: Record<string, string> = {
    "Ocp-Apim-Subscription-Key": MOMO_SUB_KEY,
    "X-Target-Environment": MOMO_ENV,
  };

  if (referenceId) headers["X-Reference-Id"] = referenceId;
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (isJson) headers["Content-Type"] = "application/json";

  console.log({headers});
  
  return headers;
};

// ========== 1. CREATE API USER ==========
export async function createApiUser() {
  const referenceId = uuidv4();

  await axios.post(
    "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser",
    { providerCallbackHost: CALLBACK_HOST },
    { headers: sandboxHeaders(referenceId) }
  );

  return referenceId;
}

// ========== 2. GET API USER INFO ==========
export async function getApiUser(userId: string) {
  const res = await axios.get(
    `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${userId}`,
    { headers: sandboxHeaders() }
  );
  return res.data;
}

// ========== 3. CREATE API KEY ==========
export async function createApiKey(userId: string) {
  const res = await axios.post(
    `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${userId}/apikey`,
    {},
    { headers: sandboxHeaders() }
  );
  return res.data.apiKey;
}

// ========== 4. GET ACCESS TOKEN ==========
export async function getAccessToken(userId: string, apiKey: string) {
  const res = await axios.post(
    "https://sandbox.momodeveloper.mtn.com/collection/token/",
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": MOMO_SUB_KEY,
        Authorization:
          "Basic " + Buffer.from(`${userId}:${apiKey}`).toString("base64"),
      },
    }
  );

  return res.data.access_token;
}
