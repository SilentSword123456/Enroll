import Link from "next/link";
import { getSchoolBySlug } from "@/lib/db/schools";
import { estimateChance, type AdmissionChance } from "@/lib/admissions/chances";

function addressToMapsUrl(address: string) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const CHANCE_LABEL: Record<AdmissionChance, string> = {
    safe: "Safe",
    target: "Almost",
    reach: "Ambitious",
    unknown: "Unknown",
};

const CHANCE_CLASS: Record<AdmissionChance, string> = {
    safe: "bg-safe/10 text-safe",
    target: "bg-gold/10 text-gold-deep",
    reach: "bg-oxblood/10 text-oxblood",
    unknown: "bg-ink/[0.05] text-ink-soft",
};

export default async function SchoolPage({
                                             params,
                                         }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const school = await getSchoolBySlug(slug);

    if (!school) {
        return (
            <div className="flex min-h-full items-center justify-center bg-page px-6">
                <p className="text-sm text-ink-soft">Liceul nu a fost găsit.</p>
            </div>
        );
    }

    const studentGrade = 9.2; // placeholder — comes from user input later

    const bySpecializare = new Map<string, typeof school.admissions>();
    for (const a of school.admissions) {
        if (!bySpecializare.has(a.specializare)) bySpecializare.set(a.specializare, []);
        bySpecializare.get(a.specializare)!.push(a);
    }

    return (
        <div className="min-h-full bg-page pb-20">
            <div className="mx-auto max-w-3xl px-6 pt-10 md:px-10">
                <Link
                    href="/highschools"
                    className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.28em] text-ink-soft transition-colors hover:text-ink"
                >
                    ← Toate liceele
                </Link>

                {/* header card */}
                <div className="relative mt-6 rounded-[2rem] bg-white p-7 pt-9 shadow-[0_1px_2px_rgba(19,27,46,0.06),0_8px_24px_rgba(19,27,46,0.08)] ring-1 ring-ink/[0.06]">
                    <div
                        aria-hidden
                        className="absolute -top-4 left-7 flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(150deg,var(--color-gold-soft),var(--color-gold)_55%,var(--color-gold-deep))] text-[13px] font-semibold text-ink shadow-[0_3px_8px_rgba(140,99,23,0.45)] ring-2 ring-white"
                    >
                        {school.name.trim().charAt(0).toUpperCase()}
                    </div>

                    <h1 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink md:text-3xl">
                        {school.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/[0.06] pt-4">
                        {school.website && (
                            <a
                                href={school.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-white"
                            >
                                Site
                            </a>
                        )}
                        {school.address && (
                            <a
                                href={addressToMapsUrl(school.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-oxblood/[0.06] px-3 py-1.5 text-xs font-medium text-oxblood transition-colors hover:bg-oxblood hover:text-white"
                            >
                                <span className="max-w-[16rem] truncate">{school.address}</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* admissions, grouped by specializare */}
                <div className="mt-8 space-y-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft">
                        Admitere &middot; medie estimată {studentGrade.toFixed(2)}
                    </p>

                    {bySpecializare.size === 0 && (
                        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-ink-soft ring-1 ring-ink/[0.06]">
                            Nu există date de admitere pentru acest liceu încă.
                        </p>
                    )}

                    {[...bySpecializare.entries()].map(([specializare, admissions]) => (
                        <div
                            key={specializare}
                            className="rounded-[1.5rem] bg-white p-6 shadow-[0_1px_2px_rgba(19,27,46,0.05),0_6px_16px_rgba(19,27,46,0.06)] ring-1 ring-ink/[0.06]"
                        >
                            <h2 className="font-serif text-lg font-semibold tracking-[-0.01em] text-ink">
                                {specializare}
                            </h2>
                            <ul className="mt-3 divide-y divide-ink/[0.06]">
                                {admissions.map((a) => {
                                    const chance = estimateChance(studentGrade, a);
                                    return (
                                        <li
                                            key={a.id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="flex items-baseline gap-3">
                                                <span className="font-mono text-sm tracking-tight text-ink">
                                                    {a.an}
                                                </span>
                                                <span className="text-sm text-ink-soft">
                                                    {a.ultimaMedie !== null
                                                        ? `medie ${Number(a.ultimaMedie).toFixed(2)}`
                                                        : "medie necunoscută"}
                                                </span>
                                            </div>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${CHANCE_CLASS[chance]}`}
                                            >
                                                {CHANCE_LABEL[chance]}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}