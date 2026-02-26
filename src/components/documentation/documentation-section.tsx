import { DocumentationSectionType } from '@/data/documentation/content';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DocumentationSectionProps {
  section: DocumentationSectionType;
}

export default function DocumentationSection({ section }: DocumentationSectionProps) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8 my-6">
      <h2 className="text-xl font-semibold text-ink">{section.title}</h2>

      {/* space-y-4: Adds consistent vertical spacing between each paragraph 
        leading-relaxed: Increases line height to make dense text easier to read
      */}
      <div className="mt-4 space-y-4 text-sm text-muted-text leading-relaxed">
        {section.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {section.references && section.references.length > 0 && (
        <div className="mt-6 pt-6 border-t border-black/[0.08]">
          <h3 className="text-sm font-medium text-ink mb-3">References & Frameworks</h3>
          <ul className="space-y-2">
            {section.references.map((ref, index) => (
              <li key={index} className="flex items-center text-sm">
                <Link
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {ref.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}