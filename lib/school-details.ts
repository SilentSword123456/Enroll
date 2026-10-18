import details from '@/data/school-details.json';
import { safeUrl } from '@/lib/preferences';

type SchoolDetails = { source?: string; socialLinks?: { label: string; url: string }[]; admissions?: { specialization: string; code: string; year: number; source: string }[] };
const directory: Record<string, SchoolDetails> = details;

export function getSchoolDetails(slug: string, specialization: string, year: number) {
    const entry = directory[slug];
    const code = entry?.admissions?.find(a => a.specialization === specialization && a.year === year && /^\d+$/.test(a.code) && safeUrl(a.source));
    return {
        detailsUrl: safeUrl(entry?.source),
        code: code?.code ?? null, codeYear: code?.year ?? null, codeSource: code ? safeUrl(code.source) : null,
        socialLinks: (entry?.socialLinks ?? []).flatMap(link => { const url = safeUrl(link.url); return url ? [{ label: link.label, url }] : []; }),
    };
}
