"use client";

import { useSchoolDistance } from "@/contexts/DistanceContext";
import { schoolToMapsUrl } from "@/lib/maps";
import { CardIconLink } from "@/components/CardIconLink";

interface DistancePinProps {
    schoolId: number;
    schoolName: string;
    address: string;
}

export function DistancePin({ schoolId, schoolName, address }: DistancePinProps) {
    const distance = useSchoolDistance(schoolId);

    return (
        <CardIconLink
            href={schoolToMapsUrl(schoolName, address)}
            label={`Deschide ${schoolName} în Google Maps`}
            text={distance !== null ? `${distance.toFixed(1)}km` : undefined}
        >
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                <path d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        </CardIconLink>
    );
}
