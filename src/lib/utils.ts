import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import fs from 'fs';
import path from 'path';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to read prompt files safely
export function getSystemInstructions(filename: string) {
  const filePath = path.join(process.cwd(), 'src/prompts', filename);
  return fs.readFileSync(filePath, 'utf8');
}

// Helper function to read JSON context files in directory
export function getJsonContexts(directoryName: string) {
  const dirPath = path.join(process.cwd(), 'public/data/', directoryName);

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return '';
  }

  // Log the directory 
  console.log(`\n--- getJsonContexts ---`);
  console.log(`Target Directory: ${dirPath}`);

  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.json'));  // Making sure only JSON files are read
  console.log(`Files found (${files.length}):`, files);

  const xmlContexts = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract filename for the XML tag
      const tagName = path.parse(file).name;

      return `<${tagName}>\n${content}\n</${tagName}>`;
    });

  // Join all XML-wrapped contexts
  return xmlContexts.join('\n\n');
}

/**
 * Load JSON array files from a directory and return only entries
 * whose `filterField` matches or is similar to `filterValue`.
 * Returns: exact match + up to `maxApproximate` fuzzy matches.
 */
export function getFilteredJsonContexts(
  directoryName: string,
  filterValue: string,
  filterField: string = 'job_title',
  maxApproximate: number = 5
): string {
  const dirPath = path.join(process.cwd(), 'public/data/', directoryName);

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return '';
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  console.log(`\n--- getFilteredJsonContexts ---`);
  console.log(`Filter: "${filterValue}" on field "${filterField}"`);

  // Normalize the filter value into lowercase keywords
  const filterKeywords = filterValue.toLowerCase().split(/[\s,\-\/]+/).filter(Boolean);

  const xmlContexts = files.map(file => {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const tagName = path.parse(file).name;

    let entries: Record<string, unknown>[];
    try {
      entries = JSON.parse(raw);
    } catch {
      console.warn(`Failed to parse ${file}, skipping`);
      return '';
    }

    if (!Array.isArray(entries)) return '';

    // 1. Find exact match (case-insensitive)
    const exact = entries.find(
      e => String(e[filterField] ?? '').toLowerCase() === filterValue.toLowerCase()
    );

    // 2. Find fuzzy matches by keyword overlap (excluding the exact match)
    const scored = entries
      .filter(e => e !== exact)
      .map(e => {
        const title = String(e[filterField] ?? '').toLowerCase();
        const titleWords = title.split(/[\s,\-\/]+/);
        const overlap = filterKeywords.filter(kw => titleWords.some(tw => tw.includes(kw) || kw.includes(tw)));
        return { entry: e, score: overlap.length };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxApproximate);

    const matched = [
      ...(exact ? [exact] : []),
      ...scored.map(s => s.entry)
    ];

    if (matched.length === 0) return '';

    console.log(`  ${tagName}: ${matched.length} entries matched (exact: ${exact ? 'yes' : 'no'}, approx: ${scored.length})`);

    const content = JSON.stringify(matched, null, 2);
    return `<${tagName}>\n${content}\n</${tagName}>`;
  }).filter(Boolean);

  const result = xmlContexts.join('\n\n');
  console.log(`  Total filtered context size: ${(result.length / 1024).toFixed(1)} KB`);
  return result;
}

// Helper: normalize career title into lowercase keywords for matching
function toKeywords(text: string): string[] {
  return text.toLowerCase().split(/[\s,\-\/()]+/).filter(Boolean);
}

// Helper: compute keyword overlap score between two strings
function keywordOverlap(a: string, b: string): number {
  const aWords = toKeywords(a);
  const bWords = toKeywords(b);
  return aWords.filter(aw => bWords.some(bw => bw.includes(aw) || aw.includes(bw))).length;
}

/**
 * Load labor-analyst JSON files with career-specific filtering.
 * - dole_jobs.json: filter by job_title (exact + fuzzy)
 * - ph_board_exam_pass_rates.json: filter professions[] by profession name
 * - All other files (macro/aggregate data): loaded as-is
 */
export function getFilteredLaborContexts(careerPathTitle: string): string {
  const dirPath = path.join(process.cwd(), 'public/data/labor-analyst');

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return '';
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  console.log(`\n--- getFilteredLaborContexts ---`);
  console.log(`Career: "${careerPathTitle}"`);

  const xmlContexts = files.map(file => {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const tagName = path.parse(file).name;

    // dole_jobs.json — array with job_title field
    if (tagName === 'dole_jobs') {
      try {
        const entries = JSON.parse(raw) as Record<string, unknown>[];
        if (!Array.isArray(entries)) return `<${tagName}>\n${raw}\n</${tagName}>`;

        const exact = entries.find(
          e => String(e.job_title ?? '').toLowerCase() === careerPathTitle.toLowerCase()
        );
        const fuzzy = entries
          .filter(e => e !== exact)
          .map(e => ({ entry: e, score: keywordOverlap(String(e.job_title ?? ''), careerPathTitle) }))
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        const matched = [...(exact ? [exact] : []), ...fuzzy.map(s => s.entry)];
        if (matched.length === 0) return `<${tagName}>\n[]\n</${tagName}>`;

        console.log(`  ${tagName}: ${matched.length} entries (exact: ${exact ? 'yes' : 'no'})`);
        return `<${tagName}>\n${JSON.stringify(matched, null, 2)}\n</${tagName}>`;
      } catch { return `<${tagName}>\n${raw}\n</${tagName}>`; }
    }

    // ph_board_exam_pass_rates.json — object with professions[] array
    if (tagName === 'ph_board_exam_pass_rates') {
      try {
        const data = JSON.parse(raw) as Record<string, unknown>;
        const professions = data.professions as Record<string, unknown>[];
        if (!Array.isArray(professions)) return `<${tagName}>\n${raw}\n</${tagName}>`;

        const exact = professions.find(
          p => String(p.profession ?? '').toLowerCase() === careerPathTitle.toLowerCase()
        );
        const fuzzy = professions
          .filter(p => p !== exact)
          .map(p => ({ entry: p, score: keywordOverlap(String(p.profession ?? ''), careerPathTitle) }))
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        const matched = [...(exact ? [exact] : []), ...fuzzy.map(s => s.entry)];

        // Keep metadata + summary but only matched professions
        const filtered = { ...data, professions: matched };
        console.log(`  ${tagName}: ${matched.length} professions (exact: ${exact ? 'yes' : 'no'})`);
        return `<${tagName}>\n${JSON.stringify(filtered, null, 2)}\n</${tagName}>`;
      } catch { return `<${tagName}>\n${raw}\n</${tagName}>`; }
    }

    // All other files — load as-is (macro/aggregate data)
    return `<${tagName}>\n${raw}\n</${tagName}>`;
  });

  const result = xmlContexts.join('\n\n');
  console.log(`  Total labor context size: ${(result.length / 1024).toFixed(1)} KB`);
  return result;
}

/**
 * Load feasibility-analyst JSON files with career-specific filtering.
 * - program_requirements.json: filter by occupation_slug and degree name
 * - scholarships.json: keep only scholarships whose priority_programs includes "all" or matches the career degree
 * - sucs.json: keep only SUCs that offer a program matching the career
 */
export function getFilteredFeasibilityContexts(careerPathTitle: string): string {
  const dirPath = path.join(process.cwd(), 'public/data/feasibility-analyst');

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return '';
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  console.log(`\n--- getFilteredFeasibilityContexts ---`);
  console.log(`Career: "${careerPathTitle}"`);

  const careerKw = toKeywords(careerPathTitle);

  // First pass: find matched program requirements to extract the degree name for downstream filtering
  let matchedDegrees: string[] = [];

  const xmlContexts = files.map(file => {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const tagName = path.parse(file).name;

    // program_requirements.json — array with occupation_slug + degree
    if (tagName === 'program_requirements' || tagName === 'program-requirements') {
      try {
        const entries = JSON.parse(raw) as Record<string, unknown>[];
        if (!Array.isArray(entries)) return `<${tagName}>\n${raw}\n</${tagName}>`;

        // Match by occupation_slug or degree name
        const scored = entries.map(e => {
          const slugScore = keywordOverlap(String(e.occupation_slug ?? ''), careerPathTitle);
          const degreeScore = keywordOverlap(String(e.degree ?? ''), careerPathTitle);
          return { entry: e, score: Math.max(slugScore, degreeScore) };
        }).filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        const matched = scored.map(s => s.entry);
        matchedDegrees = matched.map(m => String(m.degree ?? ''));

        if (matched.length === 0) return `<${tagName}>\n[]\n</${tagName}>`;

        console.log(`  ${tagName}: ${matched.length} programs matched`);
        return `<${tagName}>\n${JSON.stringify(matched, null, 2)}\n</${tagName}>`;
      } catch { return `<${tagName}>\n${raw}\n</${tagName}>`; }
    }

    // scholarships.json — array with priority_programs[]
    if (tagName === 'scholarships') {
      try {
        const entries = JSON.parse(raw) as Record<string, unknown>[];
        if (!Array.isArray(entries)) return `<${tagName}>\n${raw}\n</${tagName}>`;

        const matched = entries.filter(e => {
          const programs = e.priority_programs as string[];
          if (!Array.isArray(programs)) return false;
          // Keep if "all" or if any priority program matches career keywords
          if (programs.includes('all')) return true;
          return programs.some(p => {
            const pScore = keywordOverlap(p, careerPathTitle);
            const dScore = matchedDegrees.some(d => keywordOverlap(p, d) > 0);
            return pScore > 0 || dScore;
          });
        });

        console.log(`  ${tagName}: ${matched.length} of ${entries.length} scholarships relevant`);
        return `<${tagName}>\n${JSON.stringify(matched, null, 2)}\n</${tagName}>`;
      } catch { return `<${tagName}>\n${raw}\n</${tagName}>`; }
    }

    // sucs.json — array with programs_offered[]
    if (tagName === 'sucs') {
      try {
        const entries = JSON.parse(raw) as Record<string, unknown>[];
        if (!Array.isArray(entries)) return `<${tagName}>\n${raw}\n</${tagName}>`;

        const matched = entries.filter(e => {
          const programs = e.programs_offered as string[];
          if (!Array.isArray(programs)) return false;
          return programs.some(p => {
            const pScore = keywordOverlap(p, careerPathTitle);
            const dScore = matchedDegrees.some(d => keywordOverlap(p, d) > 0);
            return pScore > 0 || dScore;
          });
        });

        console.log(`  ${tagName}: ${matched.length} of ${entries.length} SUCs offer matching programs`);
        return `<${tagName}>\n${JSON.stringify(matched, null, 2)}\n</${tagName}>`;
      } catch { return `<${tagName}>\n${raw}\n</${tagName}>`; }
    }

    // Fallback: load as-is
    return `<${tagName}>\n${raw}\n</${tagName}>`;
  });

  const result = xmlContexts.join('\n\n');
  console.log(`  Total feasibility context size: ${(result.length / 1024).toFixed(1)} KB`);
  return result;
}