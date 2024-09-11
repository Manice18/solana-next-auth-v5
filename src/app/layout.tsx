import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

import { SessionProvider } from "next-auth/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const WalletMultiButtonDynamic = dynamic(
  async () => await import("../contexts/WalletContextProvider"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <WalletMultiButtonDynamic>{children}</WalletMultiButtonDynamic>
        </SessionProvider>
      </body>
    </html>
  );
}
