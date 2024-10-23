import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "./Googleanalytics";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "InfiniteCraft",
    description: "My version of InfinterCraft"
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className={inter.className}>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
            <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          ) : null}
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }