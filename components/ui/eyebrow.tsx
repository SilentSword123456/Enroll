import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <p className={`text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft ${className}`}>
            {children}
        </p>
    );
}
