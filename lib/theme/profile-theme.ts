export type ProfileTheme = {
    accent: string;
    textClass: string;
};

function normalize(s: string) {
    return s
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export function getProfileTheme(specializare: string): ProfileTheme {
    const n = normalize(specializare);

    if (n.includes("informatica") && n.includes("intensiv")) {
        return {
            accent: "var(--color-accent-deep)",
            textClass: "text-white",
        };
    }
    if (n.includes("mate") && n.includes("info")) {
        return {
            accent: "var(--color-accent)",
            textClass: "text-white",
        };
    }
    if (n.includes("stiinte") && n.includes("natur")) {
        return {
            accent: "var(--color-safe)",
            textClass: "text-white",
        };
    }
    if (n.includes("filologie")) {
        return {
            accent: "#c9971c",
            textClass: "text-white",
        };
    }
    return {
        accent: "var(--color-ink-soft)",
        textClass: "text-white",
    };
}