import Logo from "@/components/logo";
import NavLinks from "./nav-links";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-cream/70 backdrop-blur flex-none">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
                <Logo />
                <NavLinks />
            </div>
        </nav>
    );
}
