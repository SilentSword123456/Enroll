import { getSchoolBySlug } from "@/lib/db/schools";
import { estimateChance, type AdmissionChance } from "@/lib/admissions/chances";
import { addressToMapsUrl } from "@/lib/maps";
import { Panel } from "@/components/ui/panel";
import { SealBadge } from "@/components/ui/seal-badge";
import { ChipLink } from "@/components/ui/chip-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BackLink } from "@/components/ui/back-link";
import { Pill } from "@/components/ui/pill";

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

    // school.admissions is already ordered by [an desc, specializare asc]
    const bySpecializare = new Map<string, typeof school.admissions>();
    for (const a of school.admissions) {
        if (!bySpecializare.has(a.specializare)) bySpecializare.set(a.specializare, []);
        bySpecializare.get(a.specializare)!.push(a);
    }

    return (
        <div className="min-h-full bg-page pb-20">
            <div className="mx-auto max-w-3xl px-6 pt-10 md:px-10">
                <BackLink href="/highschools">← Toate liceele</BackLink>

                {/* header card */}
                <Panel size="lg" className="mt-6 p-7 pt-9">
                    <SealBadge letter={school.name.trim().charAt(0).toUpperCase()} left="left-7" />

                    <h1 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink md:text-3xl">
                        {school.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/[0.06] pt-4">
                        {school.website && (
                            <ChipLink href={school.website}>Site</ChipLink>
                        )}
                        {school.address && (
                            <ChipLink href={addressToMapsUrl(school.address)} variant="oxblood">
                                <span className="max-w-[16rem] truncate">{school.address}</span>
                            </ChipLink>
                        )}
                    </div>
                </Panel>

                {/* admissions, grouped by specializare */}
                <div className="mt-8 space-y-5">
                    <Eyebrow>Admitere &middot; medie estimată {studentGrade.toFixed(2)}</Eyebrow>

                    {bySpecializare.size === 0 && (
                        <p className="rounded-[1.5rem] bg-white p-6 text-sm text-ink-soft ring-1 ring-ink/[0.06]">
                            Nu există date de admitere pentru acest liceu încă.
                        </p>
                    )}

                    {[...bySpecializare.entries()].map(([specializare, admissions]) => (
                        <Panel size="md" key={specializare}>
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
                                            <Pill className={CHANCE_CLASS[chance]}>
                                                {CHANCE_LABEL[chance]}
                                            </Pill>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Panel>
                    ))}
                </div>
            </div>
        </div>
    );
}
