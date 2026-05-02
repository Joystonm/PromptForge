import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptForge AI — AI-Powered Marketing Campaign Generator",
  description: "Transform a simple campaign idea into a complete, brand-consistent marketing kit using AI.",
  keywords: ["marketing", "AI", "campaign generator", "Cloudinary", "MiniMax"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
