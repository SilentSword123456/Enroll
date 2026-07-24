import type { Admission } from "@/app/generated/prisma/client";

export type AdmissionChance = "safe" | "target" | "reach" | "unknown";

/**
 * Compares a student's grade against a profile's last admission cutoff
 * to estimate how likely they'd have gotten in.
 *
 * Kept free of Prisma/DB code on purpose: it only needs plain numbers,
 * so it's trivial to unit-test with fake data and reuse anywhere
 * (server actions, API routes, scripts) without touching the database.
 */
export function estimateChance(
    studentGrade: number,
    admission: Pick<Admission, "ultimaMedie">
): AdmissionChance {
    if (admission.ultimaMedie === null) return "unknown";

    const margin = studentGrade - Number(admission.ultimaMedie);
    if (margin >= 0.3) return "safe";
    if (margin >= -0.1) return "target";
    return "reach";
}

/** Ranks a student's saved preferences by estimated admission chance. */
export function rankPreferences(
    studentGrade: number,
    preferences: { specializare: string; admission: Pick<Admission, "ultimaMedie"> }[]
) {
    return preferences
        .map((p) => ({
            ...p,
            chance: estimateChance(studentGrade, p.admission),
        }))
        .sort((a, b) => {
            const order: Record<AdmissionChance, number> = {
                safe: 0,
                target: 1,
                reach: 2,
                unknown: 3,
            };
            return order[a.chance] - order[b.chance];
        });
}