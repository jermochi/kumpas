import Navbar from "@/components/navigation/nav-bar";
import DocumentationSection from "@/components/documentation/documentation-section";
export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Page Header */}
      <header className="px-6 py-12 md:py-20 flex flex-col items-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
          Documentation
        </h1>
        <p className="mt-4 max-w-2xl text-center text-sm text-muted-text sm:text-base">
          Learn how our Multi-Agent AI system analyzes labor markets and crafts personalized guidance roadmaps.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-4xl px-6 pb-20">
        <DocumentationSection/>
        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8 my-4">
          <h2 className="text-xl font-semibold text-ink">Getting Started</h2>
          <p className="mt-2 text-sm text-muted-text">
            This is where you can start adding your documentation content, guides, and agent explanations.
          </p>
          
          {/* Add more sections here */}
          
        </div>
        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8 my-4">
          <h2 className="text-xl font-semibold text-ink">Getting Started</h2>
          <p className="mt-2 text-sm text-muted-text">
            This is where you can start adding your documentation content, guides, and agent explanations.
          </p>
          
          {/* Add more sections here */}
          
        </div>
      </main>
    </div>
  );
}