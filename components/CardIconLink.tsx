interface CardIconLinkProps {
    href: string;
    label: string;
    children: React.ReactNode;
    text?: string;
}

export function CardIconLink({ href, label, children, text }: CardIconLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/25"
        >
            {children}
            {text && <span>{text}</span>}
        </a>
    );
}