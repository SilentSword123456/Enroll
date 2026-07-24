import type { ReactNode } from "react";

export function Pill({ className = "", children }: { className?: string; children: ReactNode }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${className}`}
        >
            {children}
        </span>
    );
}
