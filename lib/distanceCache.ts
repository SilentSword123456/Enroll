import { distanceKm } from "@/lib/geo";

export type SchoolCoord = { id: number; latitude: number; longitude: number };
export type DistanceMap = Record<number, number>;

const STORAGE_KEY = "school-distances-v1";
const MAX_AGE_MS = 30 * 60 * 1000;

export function loadCachedDistances(): DistanceMap | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { savedAt: number; distances: DistanceMap };
        if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
        return parsed.distances;
    } catch {
        return null;
    }
}

function saveCachedDistances(distances: DistanceMap) {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), distances }));
    } catch {
        // storage unavailable, skip caching silently
    }
}

function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

export function computeAndCacheDistances(
    schools: SchoolCoord[],
    onUpdate?: (distances: DistanceMap) => void
): Promise<void> {
    return new Promise((resolve) => {
        if (schools.length === 0 || typeof window === "undefined" || !("geolocation" in navigator)) {
            resolve();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const userLat = pos.coords.latitude;
                const userLon = pos.coords.longitude;
                const running: DistanceMap = {};

                for (const s of schools) running[s.id] = distanceKm(userLat, userLon, s.latitude, s.longitude);
                saveCachedDistances(running);
                onUpdate?.({ ...running });

                for (const batch of chunk(schools, 25)) {
                    try {
                        const coords = [`${userLon},${userLat}`, ...batch.map((s) => `${s.longitude},${s.latitude}`)].join(";");
                        const destinations = batch.map((_, i) => i + 1).join(";");
                        const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&destinations=${destinations}&annotations=distance`;

                        const res = await fetch(url);
                        if (!res.ok) continue;
                        const data = await res.json();
                        const row: number[] | undefined = data?.distances?.[0];
                        if (!Array.isArray(row)) continue;

                        batch.forEach((s, i) => {
                            const meters = row[i];
                            if (typeof meters === "number" && Number.isFinite(meters)) running[s.id] = meters / 1000;
                        });
                        saveCachedDistances(running);
                        onUpdate?.({ ...running });
                    } catch (err) {
                        console.error("Matrix batch failed, keeping straight-line distances for this batch", err);
                    }
                }
                resolve();
            },
            () => resolve(),
            { timeout: 5000 }
        );
    });
}