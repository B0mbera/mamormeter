import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MámorMéter",
  description: "Valós idejű alkoholfogyasztás követő — Real-time alcohol consumption tracker",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-violet-50/50 to-white">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
