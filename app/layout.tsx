import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { redirect } from "next/navigation";

import { AnonIdProvider } from "./auth/anonIdProvider";
import { getAnonId } from "./auth/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Budget",
  description: "Sharing budget app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const anonId = await getAnonId();

  if (!anonId) {
    console.log("anonId not found, redirecting to signup");
    redirect("/signup");
  }

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnonIdProvider anonId={anonId}>{children}</AnonIdProvider>
      </body>
    </html>
  );
}
