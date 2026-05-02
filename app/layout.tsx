import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Real-time campus notification platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
