export type AdmissionOption = {
    id: number; schoolId: number; schoolSlug: string; schoolName: string;
    specialization: string; profile: string; language: string; year: number;
    grade: number | null; address: string | null; website: string | null;
    latitude: number | null; longitude: number | null;
    detailsUrl?: string | null;
    code: string | null; codeYear: number | null; codeSource: string | null;
    socialLinks: { label: string; url: string }[];
};

export function normalizeLabel(value: string) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function splitSpecialization(value: string) {
    const [profile, ...language] = value.split(',');
    return { profile: profile.trim().replace(/Ş/g, 'Ș').replace(/ş/g, 'ș').replace(/Ţ/g, 'Ț').replace(/ţ/g, 'ț'), language: language.join(',').trim() || 'Fără limbă specificată' };
}

export function rankOptions(options: AdmissionOption[], profiles: string[], languages: string[], query = '') {
    const search = normalizeLabel(query);
    return options.filter(o => (!profiles.length || profiles.includes(o.profile)) && (!languages.length || languages.includes(o.language)) && normalizeLabel(`${o.schoolName} ${o.specialization}`).includes(search))
        .sort((a, b) => (profiles.indexOf(a.profile) - profiles.indexOf(b.profile)) || (languages.indexOf(a.language) - languages.indexOf(b.language)) || a.schoolName.localeCompare(b.schoolName, 'ro') || a.id - b.id);
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
    const target = index + direction;
    if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
}

export function safeUrl(value: string | null | undefined) {
    if (!value) return null;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}

export function exportList(options: AdmissionOption[]) {
    return ['Ordine\tLiceu\tSpecializare\tCod\tAn cod\tSursă cod', ...options.map((o, i) => [i + 1, o.schoolName, o.specialization, o.code ?? 'Indisponibil', o.codeYear ?? '', o.codeSource ?? ''].map(v => String(v).replace(/[\t\r\n]/g, ' ')).join('\t'))].join('\n');
}
