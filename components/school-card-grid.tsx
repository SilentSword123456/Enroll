"use client";

import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { School } from "@/app/generated/prisma/client";
import { addressToMapsUrl } from "@/lib/maps";
import { GlobeIcon, PinIcon } from "@/components/icons";
import { Panel } from "@/components/ui/panel";
import { SealBadge } from "@/components/ui/seal-badge";
import { ChipLink } from "@/components/ui/chip-link";
import { Eyebrow } from "@/components/ui/eyebrow";

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
        <Panel
            size="lg"
            interactive
            className="group p-6 pt-8"
            role="link"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            {/* hover gradient wash */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0
          bg-[radial-gradient(120%_100%_at_0%_0%,rgba(184,134,46,0.10),transparent_60%)]
          transition-opacity duration-300 group-hover:opacity-100"
            />

            <SealBadge letter={initial} left="left-6" interactive />

            <Eyebrow>Liceu &middot; {String(index + 1).padStart(2, "0")}</Eyebrow>

            <h2 className="mt-2 font-serif text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {school.name}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink/[0.06] pt-4">
                {school.website && (
                    <ChipLink
                        href={school.website}
                        icon={<GlobeIcon />}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Site
                    </ChipLink>
                )}
                {school.address && (
                    <ChipLink
                        href={addressToMapsUrl(school.address)}
                        variant="oxblood"
                        icon={<PinIcon />}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="max-w-[11rem] truncate">{school.address}</span>
                    </ChipLink>
                )}
            </div>
        </Panel>
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
