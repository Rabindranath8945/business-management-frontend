import type { Metadata } from "next";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/sidebar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MobileHeader from "@/components/layout/MobileHedaer";

export const metadata: Metadata = {
  title: "Business Manager",
  description: "Business Management App",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Toaster position="top-center" />

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Header */}
            <MobileHeader />

            <div className="p-4 pb-24">{children}</div>
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
