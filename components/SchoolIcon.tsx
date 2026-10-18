type IconName = 'pin' | 'globe' | 'social' | 'grade' | 'chevron';
const paths: Record<IconName, React.ReactNode> = {
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    social: <><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></>,
    grade: <><path d="m3 8 9-5 9 5-9 5-9-5Zm4 3v6c3 3 7 3 10 0v-6M21 8v8" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
};
export default function SchoolIcon({ name }: { name: IconName }) {
    return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0">{paths[name]}</svg>;
}
