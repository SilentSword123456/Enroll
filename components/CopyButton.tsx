"use client";

import { useState } from "react";

interface CopyButtonProps {
    content: string;
    className?: string;
}

export function CopyButton({ content, className = "" }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard unavailable, fail silently
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy address"}
            className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-current/10 text-current transition-transform duration-200 hover:scale-110 hover:bg-current/20 active:scale-90 ${className}`}
        >
            <svg
                viewBox="0 0 20 20"
                fill="none"
                className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
                    copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
            >
                <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 13V4a1 1 0 0 1 1-1h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg
                viewBox="0 0 20 20"
                fill="none"
                className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
                    copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
            >
                <path
                    d="M4 10.5l3.5 3.5L16 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}