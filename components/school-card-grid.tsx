"use client";

import { useRouter } from "next/navigation";
import type { School } from "@/app/generated/prisma/client";

function addressToMapsUrl(address: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function GlobeIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function SchoolPill({
                        school,
                        index,
                        onOpen,
                    }: {
    school: School;
    index: number;
    onOpen: () => void;
}) {
    const initial = school.name.trim().charAt(0).toUpperCase();

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
            className="group relative cursor-pointer rounded-[2rem] bg-white p-6 pt-8
        shadow-[0_1px_2px_rgba(19,27,46,0.06),0_8px_24px_rgba(19,27,46,0.08)]
        ring-1 ring-ink/[0.06]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_2px_8px_rgba(19,27,46,0.10),0_20px_40px_rgba(184,134,46,0.18)]
        hover:ring-gold/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
            {/* hover gradient wash */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0
          bg-[radial-gradient(120%_100%_at_0%_0%,rgba(184,134,46,0.10),transparent_60%)]
          transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* wax-seal monogram — highest elevation tier, floats above the card edge */}
            <div
                aria-hidden
                className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full
          bg-[linear-gradient(150deg,var(--color-gold-soft),var(--color-gold)_55%,var(--color-gold-deep))]
          text-[13px] font-semibold text-ink
          shadow-[0_3px_8px_rgba(140,99,23,0.45)]
          ring-2 ring-white
          transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            >
                {initial}
            </div>

            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft">
                Liceu &middot; {String(index + 1).padStart(2, "0")}
            </p>

            <h2 className="mt-2 font-serif text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {school.name}
            </h2>

            {/* low elevation tier — flat, recessed, tinted */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/[0.06] pt-4">
                {school.website && (
                    <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1.5
              text-xs font-medium text-ink
              transition-colors duration-200 hover:bg-ink hover:text-white"
                    >
                        <GlobeIcon />
                        Site
                    </a>
                )}
                {school.address && (
                    <a
                        href={addressToMapsUrl(school.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-oxblood/[0.06] px-3 py-1.5
              text-xs font-medium text-oxblood
              transition-colors duration-200 hover:bg-oxblood hover:text-white"
                    >
                        <PinIcon />
                        <span className="max-w-[11rem] truncate">{school.address}</span>
                    </a>
                )}
            </div>
        </div>
    );
}

export function SchoolCardGrid({ schools }: { schools: School[] }) {
    const router = useRouter();

    if (schools.length === 0) {
        return (
            <p className="px-6 py-16 text-center text-sm text-ink-soft md:px-10">
                Niciun liceu găsit deocamdată.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:p-10 lg:grid-cols-3">
            {schools.map((school, i) => (
                <SchoolPill
                    key={school.id}
                    school={school}
                    index={i}
                    onOpen={() => router.push(`/highschools/${school.slug}`)}
                />
            ))}
        </div>
    );
}