import { getAllSchools } from "@/lib/db/schools";
import { SchoolCardGrid } from "@/components/school-card-grid";

export default async function HighschoolsPage() {
    const schools = await getAllSchools();

    return (
        <div className="min-h-full bg-page">
            <header className="mx-auto max-w-5xl px-6 pt-14 md:px-10">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-ink-soft">
                    Enroll
                </p>
                <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.01em] text-ink md:text-4xl">
                    Licee
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                    {schools.length} {" "} institutions &middot; Click a card for more information
                </p>
            </header>
            <div className="mx-auto max-w-5xl">
                <SchoolCardGrid schools={schools} />
            </div>
        </div>
    );
}