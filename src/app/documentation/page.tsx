import Navbar from "@/components/navigation/nav-bar";
import DocumentationSection from "@/components/documentation/documentation-section";
import { documentationContent } from "@/data/documentation/content";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background font-sans">

      {/* Page Header */}
      <header className="px-6 py-12 md:py-20 flex flex-col items-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl text-center">
          Voice Analysis & Documentation
        </h1>
        <p className="mt-4 max-w-2xl text-center text-sm text-muted-text sm:text-base leading-relaxed">
          Learn how our Multi-Agent AI system analyzes counselor-client audio recordings using the DOLE/LMI, SCCT, and JD-R models to map psychological wellbeing and create personalized, sustainable career pathways aligned with the UN SDGs.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-4xl px-6 pb-20">
        <div className="space-y-6">
          {documentationContent.map((section, index) => (
            <DocumentationSection key={index} section={section} />
          ))}
        </div>
      </main>
    </div>
  );
}