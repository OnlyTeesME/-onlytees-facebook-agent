import { NextResponse } from "next/server";
import { generateStoreReply, humanHandoffReply, requiresHuman } from "../../../lib/agent.js";
import { sendMessengerText, verifyMetaSignature } from "../../../lib/meta.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return NextResponse.json({ error: "Webhook verification failed" }, { status: 403 });
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid Meta signature" }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.object !== "page") {
    return NextResponse.json({ ignored: true }, { status: 200 });
  }

  const events = (payload.entry || []).flatMap((entry) => entry.messaging || []);

  // Process valid message events. Meta may retry failed webhook deliveries, so
  // production teams can add durable event-id deduplication if traffic grows.
  for (const event of events) {
    try {
      const senderId = event.sender?.id;
      const message = event.message;
      if (!senderId || !message || message.is_echo) continue;

      if (!message.text) {
        await sendMessengerText(
          senderId,
          "Thanks for sending that. I can answer text questions about our products and shipping. For photos, attachments, or an order-specific issue, the store owner can review your message personally."
        );
        continue;
      }

      const customerText = message.text.trim();
      if (!customerText) continue;

      if (requiresHuman(customerText)) {
        await sendMessengerText(senderId, humanHandoffReply());
        continue;
      }

      const reply = await generateStoreReply(customerText);
      await sendMessengerText(senderId, reply);
    } catch (error) {
      console.error("Messenger event processing failed", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
