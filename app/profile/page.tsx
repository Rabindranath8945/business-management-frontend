"use client";

import { Store, User, Phone, Save, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Profile save logic goes here
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Header Layout */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account Profile
          </h1>
          <p className="text-xs font-medium text-muted-foreground/80 tracking-wide uppercase tracking-widest">
            Identity & Contact Credentials
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={12} className="stroke-[2.5]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Verified
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name Field */}
        <div className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/10 p-4 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)]">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            <Store
              size={14}
              className="text-muted-foreground/70 group-focus-within:text-primary transition-colors"
            />
            <span>Business Identity</span>
          </label>
          <div className="relative mt-2.5">
            <input
              type="text"
              name="businessName"
              defaultValue="Mandal Cycle Store"
              placeholder="e.g. Mandal Cycle Store"
              className={cn(
                "w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground/40",
                "focus:outline-none focus:ring-0 border-0 p-0 selection:bg-primary/10",
              )}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
            This name appears publicly on invoices, receipts, and reports.
          </p>
        </div>

        {/* Owner Name Field */}
        <div className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/10 p-4 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)]">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            <User
              size={14}
              className="text-muted-foreground/70 group-focus-within:text-primary transition-colors"
            />
            <span>Authorized Representative</span>
          </label>
          <div className="relative mt-2.5">
            <input
              type="text"
              name="ownerName"
              placeholder="Enter full legal name"
              className={cn(
                "w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground/40",
                "focus:outline-none focus:ring-0 border-0 p-0 selection:bg-primary/10",
              )}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
            Primary account administrator holding signatory privileges.
          </p>
        </div>

        {/* Phone Number Field */}
        <div className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/10 p-4 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)]">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            <Phone
              size={14}
              className="text-muted-foreground/70 group-focus-within:text-primary transition-colors"
            />
            <span>Secure Contact Line</span>
          </label>
          <div className="relative mt-2.5">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+91 XXXXX-XXXXX"
              className={cn(
                "w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground/40",
                "focus:outline-none focus:ring-0 border-0 p-0 selection:bg-primary/10",
              )}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
            Used strictly for programmatic OTP verifications and security
            updates.
          </p>
        </div>

        {/* Premium Save Button */}
        <button
          type="submit"
          className={cn(
            "flex items-center justify-center gap-2 w-full mt-6 p-3.5 rounded-2xl font-semibold text-sm",
            "bg-foreground text-background dark:bg-foreground dark:text-background",
            "hover:opacity-90 active:scale-[0.98] transition-all duration-200 ease-out",
            "shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
        >
          <Save size={16} strokeWidth={2.5} />
          <span>Commit Configuration Changes</span>
        </button>
      </form>
    </div>
  );
}
