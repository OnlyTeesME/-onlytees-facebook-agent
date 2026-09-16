# Only Tee's.ME — Facebook Messenger AI Agent

This is a ready-to-deploy Facebook Messenger customer-service agent built for the Only Tee's.ME Shopify store.

## What it does

- Answers product questions about Only Bands, Only Faith, Only Fins, and Only Jesus.
- Uses the current $30 base price captured from the live Shopify catalog when this package was built.
- Explains international shipping and eligible U.S. express shipping accurately.
- Does **not** promise international express shipping.
- Sends customers to exact product links when useful.
- Escalates order status, tracking, refunds, returns, exchanges, cancellations, address changes, payment issues, attachments, complaints requiring judgment, or explicit requests for a human.
- Never asks for full payment-card numbers, passwords, or highly sensitive credentials.
- Verifies Meta webhook signatures with `META_APP_SECRET`.

## Deploy on Vercel

1. Put this project in a Git repository or import the folder into Vercel.
2. Create these Vercel environment variables:
   - `OPENAI_API_KEY`
   - `META_PAGE_ACCESS_TOKEN`
   - `META_VERIFY_TOKEN`
   - `META_APP_SECRET`
   - Optional: `OPENAI_MODEL` (defaults to `gpt-5.6-luna`)
   - Optional: `STORE_OWNER_NAME` (defaults to `Frank`)
3. Deploy.
4. Open `https://YOUR-DOMAIN/api/health` and confirm all four required credentials show `true`.

## Connect Meta Messenger

In Meta for Developers, use the Facebook Page tied to Only Tee's.ME and configure the Messenger webhook callback as:

`https://YOUR-DOMAIN/api/webhook`

Use the exact same value for the Meta webhook verification token as `META_VERIFY_TOKEN` in Vercel.

Subscribe the Page to the messaging webhook events required for incoming Messenger messages. Grant the app the permissions Meta requires for Page messaging and create a Page access token for `META_PAGE_ACCESS_TOKEN`.

For live public use, complete any Meta app review / business verification that your Page and app configuration requires.

## OpenAI

The app uses OpenAI's Responses API. The default model is `gpt-5.6-luna`, which is suitable for high-volume customer-service replies. You can change the model using `OPENAI_MODEL` without changing code.

## Store knowledge

Store/product data is in `lib/store.js` and agent behavior is in `lib/agent.js`.

The four captured live products are:

- Only Bands Unisex classic tee — $30
- Only Faith Unisex classic tee — $30
- Only Fins Unisex classic tee — $30
- Only Jesus | Faith Statement Tee — $30

The bot deliberately avoids claiming exact live colors/sizes because those can change. Customers are directed to the product page for current variant availability.

## Important operational note

This package can be deployed immediately, but it cannot become active on your Facebook Page until Meta provides the Page access token/app secret and the webhook is connected to that Page. Those credentials should stay in Vercel environment variables and should never be pasted into public posts, source files, or screenshots.

## Quick test questions

After Messenger is connected, try:

- "Do you ship internationally?"
- "Can I get express shipping?"
- "How much is Only Bands?"
- "Is Only Faith unisex?"
- "Where is my order?" (should hand off)
- "I need a refund" (should hand off)
- "Can I talk to a person?" (should hand off)
