import ranks from '@/data/historical-ranks.json';
import { normalizeLabel } from '@/lib/preferences';
const benchmarks: Record<string, number> = ranks;
export function getHistoricalRank(slug: string, specialization: string, year: number) {
    const normalized = normalizeLabel(specialization).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return benchmarks[`${slug}|${normalized}|${year}`] ?? null;
}
