import type { HTMLAttributes } from "react";

const SIZE_CLASS = {
    // header cards / school pills — the "heaviest" surface
    lg: "rounded-[2rem] shadow-[0_1px_2px_rgba(19,27,46,0.06),0_8px_24px_rgba(19,27,46,0.08)]",
    // nested content cards (e.g. one per specializare) — lighter shadow
    md: "rounded-[1.5rem] shadow-[0_1px_2px_rgba(19,27,46,0.05),0_6px_16px_rgba(19,27,46,0.06)]",
} as const;

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    size?: keyof typeof SIZE_CLASS;
    interactive?: boolean;
}

export function Panel({
                           size = "lg",
                           interactive = false,
                           className = "",
                           children,
                           ...props
                       }: PanelProps) {
    return (
        <div
            className={`relative bg-white p-6 ring-1 ring-ink/[0.06] ${SIZE_CLASS[size]} ${
                interactive
                    ? "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_8px_rgba(19,27,46,0.10),0_20px_40px_rgba(184,134,46,0.18)] hover:ring-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    : ""
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
