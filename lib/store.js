export const STORE = {
  name: "Only Tee's.ME",
  owner: process.env.STORE_OWNER_NAME || "Frank",
  website: "https://onlyteesme.myshopify.com",
  products: [
    {
      name: "Only Bands Unisex classic tee",
      price: "$30.00 USD",
      url: "https://onlyteesme.myshopify.com/products/only-bands-unisex-classic-tee",
      positioning: "A bold, hustle-minded everyday statement tee."
    },
    {
      name: "Only Faith Unisex classic tee",
      price: "$30.00 USD",
      url: "https://onlyteesme.myshopify.com/products/only-faith-unisex-classic-tee",
      positioning: "A faith-inspired everyday statement tee."
    },
    {
      name: "Only Fins Unisex classic tee",
      price: "$30.00 USD",
      url: "https://onlyteesme.myshopify.com/products/only-fins-unisex-classic-tee",
      positioning: "A Miami football-inspired statement tee."
    },
    {
      name: "Only Jesus | Faith Statement Tee",
      price: "$30.00 USD",
      url: "https://onlyteesme.myshopify.com/products/only-jesus-unisex-classic-tee",
      positioning: "A clear Christian faith statement tee."
    }
  ],
  shipping: {
    international: "International shipping is available to many destinations worldwide through the store's Printful shipping profile.",
    usExpress: "Expedited / express shipping is available for eligible U.S. orders.",
    internationalExpress: "Do not promise expedited international shipping. International zones currently show flat-rate methods rather than an express method.",
    checkout: "Exact shipping methods, cost, and delivery estimates are shown at checkout for the customer's destination."
  }
};

export const PRODUCT_LIST = STORE.products
  .map((p) => `- ${p.name}: ${p.price} — ${p.positioning} Link: ${p.url}`)
  .join("\n");
