import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Topbar from "@/components/topbar";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans', 
});

export const metadata: Metadata = {
  title: "The bug",
  description: "a stackoverflow clone webapplication to find solutions to your dev problems and bugs ",
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
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col relative w-full">
            <Topbar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
            
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
