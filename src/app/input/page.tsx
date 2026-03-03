import InputContainer from "@/components/input/input-container";
import Link from "next/link";

export default function InputPage() {
  return (
    <div className="min-h-screen bg-background font-sans py-10">
      {/* Input Container */}
      <InputContainer />

      {/* Bottom spacer */}
      {/* Footer */}
      <footer className="pb-10 flex flex-col items-center gap-2">
        <div className="h-px w-48 bg-black/[0.06]" />
        <p className="text-xs text-muted-text">
          By using Kumpas, you agree to our{" "}
          <Link
            href="/privacy"
            className="font-medium text-ink underline-offset-4 hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
          {" "}·{" "}RA 10173 Compliant
        </p>
      </footer>
    </div>
  );
}
