import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedBackground } from "@/components/ui/animated-background";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoHive - Premium Car Dealership",
  description: "Discover your dream car with AutoHive's premium collection of new and used vehicles. AI-powered search and unbeatable deals.",
  keywords: ["cars", "auto", "dealership", "premium", "luxury", "vehicles"],
  authors: [{ name: "AutoHive Team" }],
  openGraph: {
    title: "AutoHive - Premium Car Dealership",
    description: "Discover your dream car with AutoHive's premium collection",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "antialiased overscroll-none bg-background text-foreground min-h-screen",
        poppins.variable,
        inter.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground variant="dots" />
          <NextTopLoader 
            showSpinner={false}
            color="#3B82F6"
            height={3}
            shadow="0 0 10px #3B82F6,0 0 5px #3B82F6"
          />
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
