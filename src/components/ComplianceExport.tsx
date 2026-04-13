"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function ComplianceExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleExport = () => {
    setIsGenerating(true);
    timerRef.current = setTimeout(() => {
      setIsGenerating(false);
      alert(
        "STL-3% Compliance PDF Generated Successfully!\n\nDocument: STL_Quarterly_Tax_Report_Q1_2026.pdf\nSize: 2.4 MB\nProperties: 6\nTotal Revenue: $124,850",
      );
    }, 2500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm text-white">Official Exports</h3>
              <p className="text-xs text-zinc-500">Shadow Compliance &amp; Reporting</p>
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-3 lg:w-auto">
            <Button
              onClick={handleExport}
              disabled={isGenerating}
              className="flex-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 lg:flex-initial"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate STL-3% Compliance PDF
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 lg:flex-initial"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Archive
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-3 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400">
            All properties compliant for Q1 2026 reporting period
          </span>
        </div>
      </div>
    </div>
  );
}
