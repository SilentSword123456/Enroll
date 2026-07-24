import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-page px-6 py-24 text-center">
            <svg
                width="72"
                height="72"
                viewBox="-1 8.4 24 15.16"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-8"
            >
                <path
                    fill="var(--color-gold)"
                    d="M21.080 12.84l-8.92-3.24c-0.4-0.16-0.88-0.2-1.16-0.2-0.32 0-0.76 0.040-1.16 0.2l-8.92 3.24c-0.84 0.32-0.92 0.88-0.92 1.12s0.080 0.8 0.92 1.12l0.4 0.12v3.32c0 0.48 0.36 0.84 0.84 0.84s0.84-0.36 0.84-0.84v-2.72l1.56 0.56v3.76c0 1.64 3.84 2.44 6.44 2.44s6.44-0.76 6.44-2.44v-3.72l3.64-1.32c0.84-0.28 0.92-0.88 0.92-1.12s-0.080-0.8-0.92-1.12zM15.8 19.92c-0.48 0.32-2.28 0.96-4.76 0.96s-4.32-0.64-4.76-0.96v-2.92l3.6 1.32c0.4 0.16 0.88 0.2 1.16 0.2s0.76-0.040 1.16-0.2l3.6-1.32v2.92zM11.6 16.72c-0.28 0.12-0.88 0.12-1.16 0l-7.64-2.76 7.6-2.76c0.28-0.12 0.88-0.12 1.16 0l7.64 2.76-7.6 2.76z"
                />
            </svg>

            <h1 className="text-5xl sm:text-6xl font-bold text-ink tracking-tight">
                Enroll
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
                Find the best high school for your needs.
            </p>

            <p className="mt-16 text-sm text-ink-soft">
                School data provided by{" "}
                <Link
                    href="https://www.bacplus.ro/"
                    target="_blank"
                    className="font-medium text-gold-deep underline hover:text-gold"
                >
                    bacplus.ro
                </Link>
            </p>
        </main>
    );
}