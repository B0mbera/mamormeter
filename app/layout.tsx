import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MámorMéter — 53. Medikus Kupa · Pécs 2026",
  description: "Az 53. Medikus Kupa hivatalos promille trackere! 🍻 Kövesd az ivásod, versenyezz az egyetemed színeiben! Pécs, 2026. április 9-11.",
  manifest: "/manifest.json",
  openGraph: {
    title: "MámorMéter — 53. Medikus Kupa",
    description: "Promille tracker a 4 orvosi egyetem versenyéhez! DOTE · POTE · SOTE · SZOTE",
    siteName: "MámorMéter",
    type: "website",
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: "MámorMéter — 53. Medikus Kupa",
    description: "Promille tracker a 4 orvosi egyetem versenyéhez! DOTE · POTE · SOTE · SZOTE",
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
        <ThemeProvider>
          <main className="min-h-screen bg-gradient-to-b from-violet-50/50 to-white dark:from-background dark:to-background">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
