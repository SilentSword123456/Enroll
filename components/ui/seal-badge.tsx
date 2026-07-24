export function SealBadge({
                               letter,
                               left = "left-6",
                               interactive = false,
                           }: {
    letter: string;
    /** Tailwind left-offset class — cards have slightly different padding */
    left?: string;
    interactive?: boolean;
}) {
    return (
        <div
            aria-hidden
            className={`absolute -top-4 ${left} flex h-9 w-9 items-center justify-center rounded-full
        bg-[linear-gradient(150deg,var(--color-gold-soft),var(--color-gold)_55%,var(--color-gold-deep))]
        text-[13px] font-semibold text-ink
        shadow-[0_3px_8px_rgba(140,99,23,0.45)]
        ring-2 ring-white
        ${interactive ? "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" : ""}`}
        >
            {letter}
        </div>
    );
}
