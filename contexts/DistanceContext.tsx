"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { computeAndCacheDistances, loadCachedDistances, type DistanceMap, type SchoolCoord } from "@/lib/distanceCache";

const DistanceCtx = createContext<DistanceMap>({});

export function useSchoolDistance(schoolId: number): number | null {
    const map = useContext(DistanceCtx);
    return map[schoolId] ?? null;
}

export function DistanceProvider({ schools, children }: { schools: SchoolCoord[]; children: React.ReactNode }) {
    const [distances, setDistances] = useState<DistanceMap>(() => loadCachedDistances() ?? {});

    useEffect(() => {
        const cached = loadCachedDistances();
        if (cached) {
            setDistances(cached);
            return;
        }
        computeAndCacheDistances(schools, setDistances);
    }, [schools]);

    return <DistanceCtx.Provider value={distances}>{children}</DistanceCtx.Provider>;
}