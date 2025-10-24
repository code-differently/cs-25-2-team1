'use client'
import { Navbar } from "./components/navbar";
import { Inter } from "next/font/google";
import useEnsureProfile from "../hooks/useEnsureProfile";
import { ClerkProvider } from '@clerk/nextjs'
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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen">
            <Navbar 
            />
            <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
