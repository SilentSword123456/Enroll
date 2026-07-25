import Link from "next/link";
import { BookIcon } from "@/components/icons/book-icon";

export default function Home() {
    return (
        <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-page px-6 py-24 text-center">
            <BookIcon className="mb-8 h-[216px] w-[216px] text-[var(--color-accent)]" />

            <h1 className="text-5xl sm:text-6xl font-bold text-ink tracking-tight">
                Enroll
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
                Find the best high school for your needs.
            </p>

            <Link
                href="/onboarding"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-deep active:translate-y-0"
            >
                Press here to get started
                <svg
                    className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 10h12m0 0l-5-5m5 5l-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Link>

            <p className="mt-16 text-sm text-ink-soft">
                School data provided by{" "}
                <Link
                    href="https://www.bacplus.ro/"
                    target="_blank"
                    className="font-medium text-accent-deep underline hover:text-accent"
                >
                    bacplus.ro
                </Link>
            </p>
        </main>
    );
}