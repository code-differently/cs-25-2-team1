'use client'
import { Inter } from "next/font/google";
import useEnsureProfile from "../hooks/useEnsureProfile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This ensures user profile is created/updated after any auth state change
  useEnsureProfile();

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
