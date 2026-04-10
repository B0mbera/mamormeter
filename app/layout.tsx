import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MámorMéter — 53. Medikus Kupa · Pécs 2026",
  description: "Az 53. Medikus Kupa hivatalos promille trackere! 🍻 Kövesd az ivásod, versenyezz az egyetemed színeiben! Pécs, 2026. április 9-11.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "MámorMéter — 53. Medikus Kupa",
    description: "Promille tracker a 4 orvosi egyetem versenyéhez! DOTE · POTE · SOTE · SZOTE",
    siteName: "MámorMéter",
  },
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
