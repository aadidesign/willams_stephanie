import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bellavita-ristorante.com"),
  title: {
    default: "Bella Vita | Authentic Italian Fine Dining",
    template: "%s · Bella Vita Ristorante",
  },
  description:
    "Bella Vita is an authentic Italian ristorante serving locally crafted food & wine since 1978. Reserve a table, host your banquet, or let us cater your next celebration.",
  keywords: [
    "Italian restaurant",
    "fine dining",
    "banquet hall",
    "catering",
    "wine bar",
    "table reservation",
    "Bella Vita",
  ],
  openGraph: {
    title: "Bella Vita | Authentic Italian Fine Dining",
    description:
      "Locally crafted Italian food & wine since 1978. Reservations, banquets & catering.",
    type: "website",
    locale: "en_US",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "font-body",
            },
          }}
        />
      </body>
    </html>
  );
}
