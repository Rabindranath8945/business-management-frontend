import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Premium safe Tailwind class name merger function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base Glassmorphism Canvas Layer
        "rounded-2xl bg-white/70 backdrop-blur-xl p-5",

        // Premium Precise Invisible Borders & Inner Rings
        "border border-white/50 ring-1 ring-slate-900/5",

        // Sophisticated Double-Layer Drop Shadows (Prevents muddy/blurry edges)
        "shadow-[0_8px_30px_rgb(0,0,0,0.015)] shadow-slate-200/40",

        // Fluid Animation Mechanics
        "transition-all duration-300 ease-out",

        // Smooth Micro-Lift Interactive States on Cursor Hover
        "hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-[0_12px_40px_rgb(0,0,0,0.03)] hover:shadow-slate-300/40",

        // Seamlessly inject dynamic custom configurations down the line
        className,
      )}
    >
      {children}
    </div>
  );
}
