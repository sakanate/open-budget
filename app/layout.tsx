import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { redirect } from "next/navigation";

import { UserProvider } from "./auth/UserProvider";
import { getUser } from "./auth/server";

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
  const { data, error } = await getUser();

  if (error) {
    console.error(error);
    redirect("/signup");
  }
  if (!data) {
    console.log("user not found, redirecting to signup");
    redirect("/signup");
  }

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider anonId={data.anonId} username={data.username}>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
