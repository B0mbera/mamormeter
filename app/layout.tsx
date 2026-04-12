import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MámorMéter — Választás 2026 · Április 12.",
  description: "A 2026-os országgyűlési választás hivatalos ivós trackere! 🗳️🍻 Kövesd az ivásod, versenyezz a pártod színeiben! Április 12.",
  manifest: "/manifest.json",
  openGraph: {
    title: "MámorMéter — Választás 2026",
    description: "Promille tracker az 5 parlamenti párt versenyéhez! FIDESZ · TISZA · Mi Hazánk · DK · MKKP",
    siteName: "MámorMéter",
    type: "website",
    locale: "hu_HU",
  },
  twitter: {
    card: "summary_large_image",
    title: "MámorMéter — Választás 2026",
    description: "Promille tracker az 5 parlamenti párt versenyéhez! FIDESZ · TISZA · Mi Hazánk · DK · MKKP",
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
