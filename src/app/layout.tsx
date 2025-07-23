import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomSidebarProvider } from "@/components/custom-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeaderBar } from "@/components/app-header-bar";

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
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <AppHeaderBar />
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                {children}
              </div>
            </main>
          </div>
        </CustomSidebarProvider>
      </body>
    </html>
  );
}
