import { getSchoolCardData } from "@/lib/db/schools";
import { getProfileTheme } from "@/lib/theme/profile-theme";
import { getShortProfileLabel } from "@/lib/theme/profile-label";
import { CardIconLink } from "@/components/CardIconLink";
import { getSchoolDetails } from "@/lib/school-details";
import { DistancePin } from "@/components/DistancePin";

interface HighschoolCardProps {
    schoolId: number;
    specializare: string;
}

export default async function HighschoolCard({ schoolId, specializare }: HighschoolCardProps) {
    const { school, admission } = await getSchoolCardData(schoolId, specializare);
    if (!school) return null;

    const theme = getProfileTheme(specializare);
    const grade = admission?.ultimaMedie ?? null;
    const gradeLabel = grade !== null ? Number(grade).toFixed(2) : "—";
    const shortProfile = getShortProfileLabel(specializare);

    return (
        <div
            className="flex h-24 w-72 shrink-0 flex-col justify-between rounded-2xl p-3.5 shadow-md ring-1 ring-black/5 text-white"
            style={{ backgroundImage: `linear-gradient(to top right, ${theme.accent}, #6b7280)` }}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-left text-sm font-bold leading-tight">
                    {school.name}
                </h3>
                <div className="shrink-0 text-lg font-bold leading-none">{gradeLabel}</div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-xs font-medium opacity-90">{shortProfile}</span>

                <div className="flex items-center gap-1.5 border-t border-white/20 pt-2">
                    {school.address && (
                        <DistancePin schoolId={school.id} schoolName={school.name} address={school.address} />
                    )}
                    {school.website && (
                        <CardIconLink href={school.website} label="Open school website">
                            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M2.5 10h15M10 2.5c2.5 2 2.5 13 0 15M10 2.5c-2.5 2-2.5 13 0 15" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </CardIconLink>
                    )}
                    {getSchoolDetails(school.slug, specializare, new Date().getFullYear()).socialLinks.map(link => (
                        <CardIconLink key={link.url} href={link.url} label={link.label}>{link.label}</CardIconLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
