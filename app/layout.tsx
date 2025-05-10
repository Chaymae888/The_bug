import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans', 
});

export const metadata: Metadata = {
  title: "The bug",
  description: "a stackoverflow clone webapplication to find solutions to your dev problems and bugs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          {children} 
          <Toaster className="bg-backgroundSecondary " />
        </ThemeProvider>
      </body>
    </html>
  );
}