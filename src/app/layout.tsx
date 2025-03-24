import type { Metadata } from "next";
import {  Mulish, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const mulish = Mulish({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car-Dealer-Website",
  description: "Car dealing website with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased overscroll-none bg-background", mulish.variable, roboto.variable)}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
