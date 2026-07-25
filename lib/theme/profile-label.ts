export function getShortProfileLabel(specializare: string): string {
    const n = specializare
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (n.includes("informatica") && n.includes("intensiv")) return "Info Intensiv";
    if (n.includes("mate") && n.includes("info")) return "Mate-Info";
    if (n.includes("stiinte") && n.includes("natur")) return "Științe N.";
    if (n.includes("filologie")) return "Filo";
    return specializare;
}