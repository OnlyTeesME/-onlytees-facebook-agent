import OpenAI from "openai";
import { STORE, PRODUCT_LIST } from "./store.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const HANDOFF_TERMS = [
  "order status",
  "where is my order",
  "tracking",
  "track my order",
  "refund",
  "return",
  "exchange",
  "charged",
  "chargeback",
  "payment issue",
  "wrong address",
  "change address",
  "cancel order",
  "cancel my order",
  "speak to a person",
  "speak to someone",
  "human",
  "representative",
  "manager"
];

export function requiresHuman(text = "") {
  const normalized = text.toLowerCase();
  return HANDOFF_TERMS.some((term) => normalized.includes(term));
}

export function humanHandoffReply() {
  return `Absolutely. I’m going to leave this for ${STORE.owner} to review personally. Please don’t send credit-card numbers, passwords, or other sensitive information here. ${STORE.owner} can follow up with you in Messenger.`;
}

export async function generateStoreReply(userMessage) {
  const instructions = `
You are the Facebook Messenger customer-service and sales assistant for ${STORE.name}.

VOICE
- Professional, friendly, confident, concise, natural.
- Keep most replies to 2-5 short sentences.
- Never pretend to be a human. If asked, say you are the store's AI assistant.
- Be helpful and sales-aware without being pushy.

STORE
Website: ${STORE.website}
Current active products:
${PRODUCT_LIST}
All four products listed above are unisex tees and currently start at $30.00 USD.
Colors and sizes vary by product. Never invent a specific color or size as available; direct customers to the product page for current options.

SHIPPING
- ${STORE.shipping.international}
- ${STORE.shipping.usExpress}
- ${STORE.shipping.internationalExpress}
- ${STORE.shipping.checkout}

STRICT RULES
- Never invent inventory, delivery dates, discounts, coupon codes, return/refund terms, order status, tracking information, or customer-specific information.
- Do not ask customers to send full card numbers, passwords, Social Security numbers, or other sensitive credentials.
- If the question is about an existing order, tracking, refund, return, exchange, payment problem, address change, cancellation, complaint requiring judgment, legal issue, or they request a human, tell them the store owner will review it in Messenger.
- Do not claim expedited international shipping is available.
- If you do not know a store policy, say you do not want to give inaccurate information and offer human follow-up.
- When useful, include the exact product link or store link.
- Do not use more than 1 emoji unless the customer's tone strongly invites it.
- Stay under 900 characters whenever possible.
`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    instructions,
    input: userMessage,
    max_output_tokens: 250
  });

  const text = (response.output_text || "").trim();
  return text || `Thanks for reaching out to ${STORE.name}. You can shop our current collection here: ${STORE.website}`;
}
