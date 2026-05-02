"use client";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { useCampaignStore } from "@/store/campaign";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEP_ORDER = WORKFLOW_STEPS.map((s) => s.id);

export function StepIndicator() {
  const step = useCampaignStore((s) => s.step);
  const currentIdx = STEP_ORDER.indexOf(step as typeof STEP_ORDER[number]);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {WORKFLOW_STEPS.map(({ id, label }, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={id} className="flex items-center gap-1 shrink-0">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              active && "bg-brand-600 text-white",
              done && "bg-brand-900/50 text-brand-400",
              !active && !done && "text-gray-600"
            )}>
              {done ? <Check className="w-3 h-3" /> : (
                <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[10px]",
                  active ? "bg-white/20" : "bg-white/5"
                )}>{i + 1}</span>
              )}
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className={cn("w-4 h-px", done ? "bg-brand-600" : "bg-white/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
