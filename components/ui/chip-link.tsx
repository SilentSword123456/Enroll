import type { ReactNode, MouseEvent } from "react";

const VARIANT_CLASS = {
    neutral: "bg-ink/[0.04] text-ink hover:bg-ink hover:text-white",
    oxblood: "bg-oxblood/[0.06] text-oxblood hover:bg-oxblood hover:text-white",
} as const;

export function ChipLink({
                              href,
                              variant = "neutral",
                              icon,
                              children,
                              onClick,
                          }: {
    href: string;
    variant?: keyof typeof VARIANT_CLASS;
    icon?: ReactNode;
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${VARIANT_CLASS[variant]}`}
        >
            {icon}
            {children}
        </a>
    );
}
