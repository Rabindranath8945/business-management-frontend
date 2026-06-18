"use client";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Share2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ExportMenu() {
  const handleExport = (format: string) => {
    console.log(`Executing telemetry data pipeline for format: ${format}`);
    // Trigger your localized programmatic export engines here
  };

  return (
    <DropdownMenu>
      {/* Trigger: High-End Custom Selector Button */}
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Document Export Actions"
          className={cn(
            "inline-flex items-center justify-between gap-2.5 h-10 px-4 rounded-xl border border-border/60",
            "bg-gradient-to-b from-background to-muted/20 text-foreground font-semibold text-sm",
            "shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-muted/40 active:scale-95 transition-all duration-200",
            "data-[state=open]:bg-muted data-[state=open]:ring-2 data-[state=open]:ring-primary/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <div className="flex items-center gap-2">
            <Download
              size={15}
              strokeWidth={2.25}
              className="text-muted-foreground/80"
            />
            <span>Export Report</span>
          </div>
          <ChevronDown
            size={14}
            strokeWidth={2.25}
            className="text-muted-foreground/50 transition-transform duration-200 data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Container Matrix */}
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-56 p-1.5 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl animate-in fade-in-50 zoom-in-95 duration-100"
      >
        {/* Section 1: Hardcopy Documents Layout */}
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Compile Documents
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 bg-border/60" />

        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => handleExport("PDF")}
            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors cursor-pointer focus:bg-primary/5 focus:text-foreground"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <FileText size={14} strokeWidth={2.5} />
            </div>
            <span>Portable PDF</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleExport("Excel")}
            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors cursor-pointer focus:bg-primary/5 focus:text-foreground"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={14} strokeWidth={2.5} />
            </div>
            <span>Excel Spreadsheet</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleExport("Print")}
            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors cursor-pointer focus:bg-primary/5 focus:text-foreground"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 group-hover:scale-105 transition-transform">
              <Printer size={14} strokeWidth={2.5} />
            </div>
            <span>Hardware Print</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Section 2: Over-The-Air Data Dispatch */}
        <DropdownMenuSeparator className="mx-1 mt-1.5 bg-border/60" />
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          External Dispatch
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 bg-border/60" />

        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => handleExport("Share")}
            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors cursor-pointer focus:bg-primary/5 focus:text-foreground"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Share2 size={14} strokeWidth={2.5} />
            </div>
            <span>Native Share Hub</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleExport("WhatsApp")}
            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 transition-colors cursor-pointer focus:bg-primary/5 focus:text-foreground"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
              <MessageCircle size={14} strokeWidth={2.5} />
            </div>
            <span>WhatsApp Business</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
