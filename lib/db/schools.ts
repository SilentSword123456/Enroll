import { prisma } from "@/lib/prisma";

export async function getAllSchools() {
    return prisma.school.findMany({
        orderBy: { name: "asc" },
    });
}

export async function getSchoolBySlug(slug: string) {
    return prisma.school.findUnique({
        where: { slug },
        include: {
            admissions: {
                orderBy: [{ an: "desc" }, { specializare: "asc" }],
            },
        },
    });
}

export async function getAllSchoolsWithAdmissions() {
    return prisma.school.findMany({
        orderBy: { name: "asc" },
        include: { admissions: true },
    });
}

export async function searchSchools(query: string) {
    return prisma.school.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
    });
}