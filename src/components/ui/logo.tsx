import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105">
                <Image src="/kumpas-logo.png" alt="Logo" width={1000} height={1000} />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-ink">
                Kumpas
            </span>
        </Link>
    );
}