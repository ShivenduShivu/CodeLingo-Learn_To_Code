import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { SoundProvider } from "@/components/providers/sound-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Gamified Learning Platform",
  description: "Learn Python and Machine Learning through gamified lessons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <SoundProvider />
        {children}
      </body>
    </html>
  );
}
