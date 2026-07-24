import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.28em] text-ink-soft transition-colors hover:text-ink"
        >
            {children}
        </Link>
    );
}
