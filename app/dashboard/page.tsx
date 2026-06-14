"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Suspense } from "react";
import Header from "@/components/dashboard/temp";
import KpiCards from "@/components/dashboard/KpiCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStock from "@/components/dashboard/LowStock";
import axios from "axios";
import { DashboardData } from "@/types/dashboard";

// Premium skeleton loader for visual continuity during data fetching
function DashboardSkeleton() {
  return (
    <div className="w-full h-48 animate-pulse rounded-2xl bg-slate-200/60 blur-[1px]" />
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
      );
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-gray-50 to-indigo-50/30 px-6 py-8 md:px-8 pb-28 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Maximum width container to keep layout elegant on ultra-wide screens */}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="transition-all duration-300 ease-in-out">
          <Header />
        </header>

        {/* High-Priority Metrics Grid */}
        <section aria-label="Key Performance Indicators">
          <KpiCards dashboard={dashboard} />
        </section>

        {/* Main Analytics Grid Workspace */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Visual Data Column */}
          <section
            className="lg:col-span-2 space-y-8"
            aria-label="Sales Analytics"
          >
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-1 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Suspense fallback={<DashboardSkeleton />}>
                <SalesChart chartData={dashboard?.salesChart || []} />
              </Suspense>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-1 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Suspense fallback={<DashboardSkeleton />}>
                <RecentSales sales={dashboard?.recentSales || []} />
              </Suspense>
            </div>
          </section>

          {/* Sidebar Urgent Operations Column */}
          <aside className="lg:col-span-1" aria-label="Operational Alerts">
            <div className="sticky top-8 rounded-2xl border border-rose-100/50 bg-white/90 p-1 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring-1 ring-rose-500/5">
              <Suspense fallback={<DashboardSkeleton />}>
                <LowStock products={dashboard?.lowStockProducts || []} />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
