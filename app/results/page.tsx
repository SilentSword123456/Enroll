import { getAllSchools } from "@/lib/db/schools";
import HighschoolCard from "@/components/HighschoolCard";
import { DistanceProvider } from "@/contexts/DistanceContext";

export default async function Results({ searchParams }: { searchParams: Promise<{ pos?: string }> }) {
    const { pos } = await searchParams;
    const schools = await getAllSchools();
    const profiles = ["Matematică-Informatică", "Științe ale Naturii"];

    const coords = schools
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({ id: s.id, latitude: s.latitude!, longitude: s.longitude! }));

    return (
        <DistanceProvider schools={coords}>
            <div className="flex flex-col items-center gap-4 px-6 py-12">
                {schools.map((school) =>
                    profiles.map((profile) => (
                        <HighschoolCard key={`${school.id}-${profile}`} schoolId={school.id} specializare={profile} />
                    ))
                )}
            </div>
        </DistanceProvider>
    );
}