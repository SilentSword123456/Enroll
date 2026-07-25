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