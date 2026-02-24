import Link from "next/link";

export default function NavLinks() {
    return (
        <div className="flex items-center gap-2 md:gap-4">
            {/* to be linked to documentation page*/}
            <Link
                href="/docs"
                className="text-sm font-medium text-muted-text transition-colors hover:text-ink"
            >
                Documentation
            </Link>
            {/* to be linked to our github*/}
            <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:border-black/[0.15] hover:shadow-md"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="hidden sm:inline">Star on GitHub</span>
                <span className="sm:hidden">Star</span>
            </a>
        </div>
    );
}
