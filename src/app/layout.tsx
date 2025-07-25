import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomSidebarProvider } from "@/components/custom-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claims App - Digital Inspection Management",
  description: "Comprehensive digital claim and inspection management system for service businesses working with insurance companies and corporate clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomSidebarProvider>
          <div className="min-h-screen w-full relative bg-gray-50">
            {/* Main Content Area - Always Full Width, Never Moves */}
            <main className="min-h-screen flex flex-col w-full bg-white lg:ml-64">
              {/* Mobile/Tablet Header with Hamburger Menu */}
              <MobileHeader />
              
              {/* Content Area - Always Visible */}
              <div className="flex-1 min-h-screen bg-white p-4 lg:p-6">
                {children}
              </div>
            </main>
            
            {/* Sidebar - Floats On Top */}
            <AppSidebar />
          </div>
        </CustomSidebarProvider>
      </body>
    </html>
  );
}
