import crypto from "node:crypto";

const GRAPH_VERSION = "v26.0";

export function verifyMetaSignature(rawBody, signatureHeader) {
  const secret = process.env.META_APP_SECRET;
  if (!secret) return false;
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex")}`;

  const provided = Buffer.from(signatureHeader, "utf8");
  const wanted = Buffer.from(expected, "utf8");
  if (provided.length !== wanted.length) return false;
  return crypto.timingSafeEqual(provided, wanted);
}

export async function sendMessengerText(recipientId, text) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("META_PAGE_ACCESS_TOKEN is not configured");

  const messageText = String(text).slice(0, 1900);
  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/me/messages?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        messaging_type: "RESPONSE",
        message: { text: messageText }
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta Send API failed (${response.status}): ${body}`);
  }

  return response.json();
}
