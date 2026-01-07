import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WGG Encryptor - Lua File Encryption",
  description: "Encrypt lua files for WGG Unlocker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
