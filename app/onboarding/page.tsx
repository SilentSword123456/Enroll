"use client";

import { useState } from "react";
import Link from "next/link";
import PositionInput from "@/components/PositionInput";

export default function Onboarding() {
    const [position, setPosition] = useState("");

    const isValid = position.length > 0;

    return (
        <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-page px-6 py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight">
                Onboarding
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
                Enter your position in the Bucharest ranking to see your chances.
            </p>

            <div className="mt-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-lg ring-1 ring-ink/[0.06]">
                <label
                    htmlFor="position-input"
                    className="block text-sm font-medium text-ink-soft"
                >
                    Your position in the ranking
                </label>

                <div className="mt-4 flex justify-center">
                    <PositionInput value={position} onChange={setPosition} />
                </div>

                <p className="mt-6 text-sm text-ink-soft">
                    Find it on{" "}
                    <Link
                        href="https://static.admitere.edu.ro/2026/ierarhie/index.html"
                        target="_blank"
                        className="font-medium text-accent-deep underline hover:text-accent"
                    >
                        admitere.edu.ro
                    </Link>
                    : pick your județ, paste the unique code from your school, then copy
                    the &#34;Poziția în ierarhie&#34; field.
                </p>

                <Link
                    href={isValid ? `/results?pos=${position}` : "#"}
                    aria-disabled={!isValid}
                    onClick={(e) => {
                        if (!isValid) e.preventDefault();
                    }}
                    className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:translate-y-0 aria-disabled:hover:bg-ink"
                >
                    Check my chances
                    <svg
                        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 10h12m0 0l-5-5m5 5l-5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </main>
    );
}