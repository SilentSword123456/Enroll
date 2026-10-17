import { prisma } from "@/lib/prisma";

export async function getAllSchools() {
    return prisma.school.findMany({
        orderBy: { name: "asc" }
    });
}

export async function getAllSchoolCoords() {
    const schools = await prisma.school.findMany({
        where: { latitude: { not: null }, longitude: { not: null } },
        select: { id: true, latitude: true, longitude: true },
    });
    return schools as { id: number; latitude: number; longitude: number }[];
}

export async function getSchoolCardData(schoolId: number, specializare: string) {
    const [school, admission] = await Promise.all([
        prisma.school.findUnique({ where: { id: schoolId } }),
        prisma.admission.findFirst({
            where: { schoolId, specializare },
            orderBy: { an: "desc" },
        }),
    ]);
    return { school, admission };
}

// Fetch admissions in one query rather than two queries per school/profile card.
export async function getAdmissionOptions() {
    const { splitSpecialization } = await import('@/lib/preferences');
    const { getSchoolDetails } = await import('@/lib/school-details');
    const admissions = await prisma.admission.findMany({
        include: { school: true },
        orderBy: [{ an: 'desc' }, { id: 'asc' }],
    });
    const seen = new Set<string>();
    return admissions.filter(a => {
        const key = `${a.schoolId}:${a.specializare}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).map(a => ({
        id: a.id, schoolId: a.schoolId, schoolSlug: a.school.slug, schoolName: a.school.name,
        specialization: a.specializare, ...splitSpecialization(a.specializare), year: a.an,
        grade: a.ultimaMedie === null ? null : Number(a.ultimaMedie),
        address: a.school.address, website: a.school.website,
        latitude: a.school.latitude, longitude: a.school.longitude,
        ...getSchoolDetails(a.school.slug, a.specializare, new Date().getFullYear()),
    }));
}
