"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen p-4">
      <h1 className="text-xl font-bold mb-5">Business Manager</h1>

      <nav className="space-y-3">
        <Link href="/products">Products</Link>
        <br />
        <Link href="/purchases">Purchases</Link>
        <br />
        <Link href="/sales">Sales</Link>
        <br />
        <Link href="/settings">Settings</Link>
      </nav>
    </div>
  );
}
