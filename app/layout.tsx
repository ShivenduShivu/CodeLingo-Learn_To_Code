import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ParticlesBackground } from "@/components/layout/particles-background";
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
      <body className={`${inter.variable} font-sans antialiased text-white min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black relative`}>
        {/* Global Light Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.2),transparent)] pointer-events-none z-0" />
        
        {/* Global Floating Particles */}
        <ParticlesBackground />

        <div className="relative z-10 w-full h-full">
          <SoundProvider />
          {children}
        </div>
      </body>
    </html>
  );
}
