import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "enroll-app/1.0 (school directory geocoding, one-time run)",
        },
    });

    if (!res.ok) {
        console.error(`  HTTP ${res.status} for "${address}"`);
        return null;
    }

    const results = (await res.json()) as { lat: string; lon: string }[];
    if (results.length === 0) return null;

    return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
}

async function main() {
    const schools = await prisma.school.findMany({
        where: {
            address: { not: null },
            latitude: null,
        },
    });

    console.log(`Geocoding ${schools.length} schools missing coordinates...`);

    let success = 0;
    let failed = 0;

    for (const school of schools) {
        if (!school.address) continue;

        const result = await geocode(school.address);

        if (result) {
            await prisma.school.update({
                where: { id: school.id },
                data: { latitude: result.lat, longitude: result.lon },
            });
            console.log(`  ✓ ${school.name} -> ${result.lat}, ${result.lon}`);
            success++;
        } else {
            console.log(`  ✗ ${school.name} -> no match for "${school.address}"`);
            failed++;
        }

        await sleep(1100);
    }

    console.log(`Done. ${success} geocoded, ${failed} failed.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());