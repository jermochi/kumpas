import { sdgContent } from '@/data/documentation/content';

export default function DocumentationSection() {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8 my-4x">
      <h2 className="text-xl font-semibold text-ink">{sdgContent.title}</h2>
      {/* space-y-4: Adds consistent vertical spacing between each paragraph 
        leading-relaxed: Increases line height to make dense text easier to read
      */}
      <div className="mt-4 space-y-4 text-sm text-muted-text leading-relaxed">
        {sdgContent.paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}