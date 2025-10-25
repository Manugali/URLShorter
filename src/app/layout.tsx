import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { redirect } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shortly - URL Shortener",
  description: "Create short, memorable links that are easy to share and track. Perfect for social media, marketing campaigns, and more.",
  keywords: ["URL shortener", "link shortener", "short links", "URL management"],
  authors: [{ name: "Shortly Team" }],
  openGraph: {
    title: "Shortly - URL Shortener",
    description: "Create short, memorable links that are easy to share and track.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
