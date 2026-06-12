import "./globals.css";
import Sidebar from "@/components/sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex">
        <Toaster position="top-center" />
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
