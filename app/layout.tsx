import type { Metadata } from "next";
import { Lobster, Manrope } from "next/font/google";
import "./globals.css";

const display = Lobster({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vespera — бутик-отель",
  description:
    "Vespera — бутик-отель с тихими вечерами, изысканными номерами и внимательным гостеприимством.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
