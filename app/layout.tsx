import type { Metadata } from "next";

import "./globals.css";
import Sidebar from "@/components/sidebar";
import { Toaster } from "react-hot-toast";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
            <header className="md:hidden flex items-center gap-3 p-4 border-b sticky top-0 bg-background z-50">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar />
                </SheetContent>
              </Sheet>

              <h1 className="font-bold text-lg">Mandal Cycle Store</h1>
            </header>

            <div className="p-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
