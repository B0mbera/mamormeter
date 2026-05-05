import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EFOTT Ivásszámláló — EFOTT 2026 · Velencei-tó",
  description: "Az EFOTT fesztivál hivatalos ivós trackere! 🎪🍻 Kövesd az ivásod, versenyezz az egyetemed színeiben!",
  manifest: "/manifest.json",
  openGraph: {
    title: "EFOTT Ivásszámláló — EFOTT 2026",
    description: "Promille tracker az EFOTT-on. Versenyezz az egyetemed haverjaival! ELTE · BME · SZTE · DE · PPKE és még sokan mások.",
    siteName: "EFOTT Ivásszámláló",
    type: "website",
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: "EFOTT Ivásszámláló — EFOTT 2026",
    description: "Promille tracker az EFOTT-on. Versenyezz az egyetemed haverjaival!",
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
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
