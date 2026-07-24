// prisma/seed.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import fs from "fs";
import { parse } from "csv-parse/sync";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(name: string) {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function readCsv(path: string, delimiter: string): any[] {
    const buf = fs.readFileSync(path);
    const raw = new TextDecoder("utf-8").decode(buf);
    return parse(raw, { columns: true, skip_empty_lines: true, delimiter, bom: true });
}

async function main() {
    const rows = readCsv("admitere_specializari_1_in_.csv", ",");

    // schools_summary_in_.csv is semicolon-delimited: school;website;address
    const summaryRows = readCsv("schools_summary_in_.csv", ";");
    const contactByName = new Map<string, { website: string | null; address: string | null }>();
    for (const r of summaryRows) {
        contactByName.set(r.school, {
            website: r.website?.trim() || null,
            address: r.address?.trim() || null,
        });
    }

    const bySchool = new Map<string, typeof rows>();
    for (const row of rows) {
        if (!bySchool.has(row.school_name)) bySchool.set(row.school_name, []);
        bySchool.get(row.school_name)!.push(row);
    }

    for (const [rawName, schoolRows] of bySchool) {
        const name = rawName;
        const contact = contactByName.get(name);

        const school = await prisma.school.upsert({
            where: { slug: slugify(name) },
            update: {
                name,
                website: contact?.website ?? null,
                address: contact?.address ?? null,
            },
            create: {
                name,
                slug: slugify(name),
                website: contact?.website ?? null,
                address: contact?.address ?? null,
            },
        });

        for (const r of schoolRows) {
            if (!r.year || !r.profil) continue;
            const specializare = r.profil;
            await prisma.admission.upsert({
                where: {
                    schoolId_an_specializare: {
                        schoolId: school.id,
                        an: parseInt(r.year),
                        specializare,
                    },
                },
                update: {
                    ultimaMedie: r.ultima_medie ? parseFloat(r.ultima_medie) : null,
                    eleviAdmisi: r.elevi_admisi ? parseInt(r.elevi_admisi) : null,
                },
                create: {
                    schoolId: school.id,
                    an: parseInt(r.year),
                    specializare,
                    ultimaMedie: r.ultima_medie ? parseFloat(r.ultima_medie) : null,
                    eleviAdmisi: r.elevi_admisi ? parseInt(r.elevi_admisi) : null,
                },
            });
        }
    }
    console.log(`Seeded ${bySchool.size} schools.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());