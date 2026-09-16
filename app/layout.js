export const metadata = {
  title: "Only Tee's.ME AI Agent",
  description: "Facebook Messenger customer-service agent"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
