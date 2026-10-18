import { getAdmissionOptions } from '@/lib/db/schools';
import ResultsExplorer from '@/components/ResultsExplorer';

export const dynamic = 'force-dynamic';

export default async function Results({ searchParams }: { searchParams: Promise<{ pos?: string }> }) {
    const { pos } = await searchParams;
    const position = pos && /^\d+$/.test(pos) && Number(pos) > 0 && Number(pos) <= 20000 ? Number(pos) : null;
    return <ResultsExplorer options={await getAdmissionOptions()} position={position} />;
}
