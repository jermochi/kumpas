"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Target, Heart, Wallet, Flag, MessageSquare,
  ChevronDown, Download, Image as ImageIcon, Loader2,
  AlertTriangle, X, ScanText, Check, FolderOpen, Info, Sparkles,
} from "lucide-react";
import WysiwygField from "./wysiwyg-field";
import FileSlot from "./file-slot";
import { toast } from "sonner";
import { ExtractedNotes, EMPTY_NOTES } from "@/lib/analysis-types";

/* ─── section config ─── */
const SECTIONS = [
  { key: "careerGoal",  label: "Career Goal",                      icon: Target,        iconBg: "#dcfce7", iconFg: "#166534", labelColor: "#166534", ph: "Start typing the student's career goal here…" },
  { key: "interests",   label: "Personal Interests & Strengths",   icon: Heart,         iconBg: "#fef08a", iconFg: "#854d0e", labelColor: "#b45309", ph: "Describe the student's interests and natural strengths…" },
  { key: "financial",   label: "Family & Financial Situation",     icon: Wallet,        iconBg: "#ecfccb", iconFg: "#3f6212", labelColor: "#3f6212", ph: "Note the family support situation and any financial constraints…" },
  { key: "concerns",    label: "Concerns & Red Flags",             icon: Flag,          iconBg: "#fee2e2", iconFg: "#991b1b", labelColor: "#b91c1c", ph: "Flag any mismatches or concerns you observed…" },
  { key: "impression",  label: "Counselor's Overall Impression",   icon: MessageSquare, iconBg: "#d1fae5", iconFg: "#065f46", labelColor: "#065f46", ph: "Write your overall impression of the student…" },
] as const;

const GUIDE = [
  { icon: Target,        title: "Section 1 — Career Goal",                   bullets: ["What course or career does the student want to pursue?", "Why do they want this? Write their exact words.", "How certain are they?", "Do they have a backup plan?"] },
  { icon: Heart,         title: "Section 2 — Personal Interests & Strengths", bullets: ["Subjects or activities they enjoy the most", "What they are naturally good at", "Topics that made them visibly excited during the interview"] },
  { icon: Wallet,        title: "Section 3 — Family & Financial Situation",   bullets: ["Can the family support the preferred course?", "Is there family pressure toward a specific career?", "Any financial or logistical barriers?"] },
  { icon: Flag,          title: "Section 4 — Concerns & Red Flags",           bullets: ["Any mismatch between stated goal and observed strengths", "Does the student understand what the career involves day-to-day?", "Signs external pressure is overriding genuine interest"] },
  { icon: MessageSquare, title: "Section 5 — Counselor's Overall Impression", bullets: ["Free-form narrative — gut feel, confidence in their goals", "Anything not captured in sections above", "Recommended focus areas for AI analysis"] },
];

const OVERLAY_STEPS = [
  { title: "Reading counselor notes…",        sub: "AI Vision is parsing your handwriting" },
  { title: "Extracting sections…",            sub: "Identifying Career Goal, Interests, Red Flags…" },
  { title: "Processing supporting docs…",     sub: "Reading NCAE scores and academic records" },
  { title: "Labor Market Analysis…",          sub: "Matching against PSA employment statistics" },
  { title: "Feasibility Analysis…",           sub: "Evaluating financial and logistical factors" },
  { title: "Labor Demand Analysis…",          sub: "Identifying passion-skill alignment" },
  { title: "Generating guidance roadmap…",    sub: "Synthesizing all three agent outputs" },
];

type SectionHtml = Record<string, string>;

export default function InputContainer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* state */
  const [guideOpen, setGuideOpen]       = useState(false);
  const [notesFile, setNotesFile]       = useState<File | null>(null);
  const [drag, setDrag]                 = useState(false);
  const [scanning, setScanning]         = useState(false);
  const [scanError, setScanError]       = useState<string | null>(null);
  const [sectionsReady, setSectionsReady] = useState(false);
  const [sectionHtml, setSectionHtml]   = useState<ExtractedNotes>(EMPTY_NOTES);
  const [slotFiles, setSlotFiles]       = useState<{ 1: File | null; 2: File | null }>({ 1: null, 2: null });
  const [slotTypes, setSlotTypes]       = useState<{ 1: string; 2: string }>({ 1: "", 2: "" });
  const [analyzing, setAnalyzing]       = useState(false);
  const [analyzeStep, setAnalyzeStep]   = useState(0);

  /* helpers */
  const hasDocs   = !!(slotFiles[1] || slotFiles[2]);
  const canAnalyze = sectionsReady && !scanning && !scanError;

  /* ─── extraction ─── */
  const resetAll = () => {
    setNotesFile(null); setScanning(false); setScanError(null);
    setSectionsReady(false);
    setSectionHtml(EMPTY_NOTES);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const extractSections = (file: File) => {
    setScanning(true); setScanError(null); setSectionsReady(false);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const b64 = (e.target?.result as string).split(",")[1];
        const res = await fetch("/api/extract-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: b64, mimeType: file.type }),
        });
        if (!res.ok) throw new Error("Extraction failed");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        const notes: ExtractedNotes = {
          careerGoal: data.careerGoal || "",
          interests:  data.interests  || "",
          financial:  data.financial  || "",
          concerns:   data.concerns   || "",
          impression: data.impression || "",
        };
        setSectionHtml(notes);
        setSectionsReady(true);
      } catch { setScanError("Could not read the notes. Please ensure the image is clear and well-lit, then try again."); }
      finally { setScanning(false); }
    };
    reader.onerror = () => { setScanError("File read error"); setScanning(false); };
    reader.readAsDataURL(file);
  };

  const handleNotesSelect = (f: File | null) => {
    if (!f) { resetAll(); return; }
    if (!f.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please upload an image file (JPG, PNG, etc.)", position: "top-center" });
      return;
    }
    setNotesFile(f);
    extractSections(f);
  };

  /* ─── analysis ─── */
  const beginAnalysis = () => {
    setAnalyzing(true); setAnalyzeStep(1);
    let step = 1;
    const iv = setInterval(() => {
      step++;
      if (step > OVERLAY_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => {
          const combined = SECTIONS.map(s => `${s.label}: ${sectionHtml[s.key]}`).join("\n\n");
          const sid = crypto.randomUUID();
          sessionStorage.setItem(`kumpas-session-${sid}`, JSON.stringify({ rawTranscript: combined, createdAt: new Date().toISOString() }));
          router.push(`/analysis?session=${sid}`);
        }, 800);
      } else setAnalyzeStep(step);
    }, 1100);
  };

  let helperText = "Upload the counselor's notes photo to enable analysis";
  if (scanning) helperText = "Scanning your notes with AI Vision…";
  else if (scanError) helperText = "Fix the notes image to enable analysis";
  else if (sectionsReady && !hasDocs) helperText = "";
  else if (sectionsReady && hasDocs) helperText = "";

  return (
    <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 relative">
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-cream-light shadow-card">

        <div className="p-6 sm:p-8">

          {/* Title */}
          <div className="flex items-start gap-3 mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage/10 text-sage"><FileText size={20} /></div>
            <div>
              <h2 className="text-base font-semibold text-ink leading-snug">
                Counselor Notes
                <span className="ml-2 inline-block align-middle rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold uppercase text-white">Required</span>
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-text">Write your interview notes, take a clear photo, and upload it. The AI will populate each section — edit directly like a document.</p>
            </div>
          </div>

          {/* ─ Guide accordion ─ */}
          <div className="mb-5 rounded-xl border border-sage/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setGuideOpen(!guideOpen)}
              className="flex w-full items-center justify-between px-4 py-3 bg-sage/[0.07] text-sage text-[13px] font-medium cursor-pointer hover:bg-sage/[0.12] transition-colors"
            >
              <span className="flex items-center gap-2"><Info size={16} /> Notes Format Guide — What to write in each section</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${guideOpen ? "rotate-180" : ""}`} />
            </button>
            {guideOpen && (
              <div className="p-4 space-y-4 animate-fade-in">
                {GUIDE.map((g) => (
                  <div key={g.title} className="flex gap-3">
                    <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-sage/10 text-sage"><g.icon size={14} /></div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-3 mb-1">{g.title}</h4>
                      <span className="text-xs text-muted-text">Example Questions:</span>
                      <ul className="list-disc pl-4 text-[13px] text-charcoal-3 leading-relaxed">{g.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-2.5 rounded-lg bg-amber/10 p-3 text-amber text-xs leading-snug">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  Free-writing is okay! Just label each section. The AI reads your labels and populates the editors automatically.
                </div>
              </div>
            )}
          </div>

          {/* ─ Download Row ─ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-cream-dark/60 p-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-ink">Download &amp; Print the Notes Form</h3>
              <p className="text-xs text-muted-text">Pre-structured form you can fill out by hand during the session</p>
            </div>
            <a href="/kumpas_career_interview_notes.pdf" download className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-sage/80 whitespace-nowrap">
              <Download size={16} /> Download PDF
            </a>
          </div>

          {/* ─ Upload / Pill ─ */}
          {!notesFile ? (
            <div
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-all ${drag ? "border-sage bg-sage/[0.04]" : "border-black/10 bg-cream/40 hover:border-black/20"}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleNotesSelect(e.dataTransfer.files?.[0] || null); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-sage"><ImageIcon size={24} /></div>
              <p className="text-[15px] font-semibold text-ink">Upload photo of your notes</p>
              <p className="mt-1 text-[13px] text-muted-text"><span className="text-sage font-medium">Tap to choose</span> or drag &amp; drop an image here</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleNotesSelect(e.target.files?.[0] || null)} />
            </div>
          ) : (
            <>
              {/* Notes Pill */}
              <div className="flex items-center gap-3 rounded-xl border border-sage/20 bg-sage/[0.04] p-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${scanning ? "bg-amber" : scanError ? "bg-red-soft" : "bg-sage"}`}>
                  {scanning ? <Loader2 size={20} className="animate-spin" /> : scanError ? <AlertTriangle size={20} /> : <ImageIcon size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">{notesFile.name}</p>
                  <p className={`text-[11px] ${scanError ? "text-red-soft" : "text-muted-text"}`}>
                    {scanning ? "Reading handwriting with AI Vision…" : scanError ? scanError : `${(notesFile.size / 1024).toFixed(0)} KB · Extracted & ready to edit`}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${scanning ? "bg-amber/15 text-amber" : scanError ? "bg-red-soft/15 text-red-soft" : "bg-white border border-sage/20 text-sage"}`}>
                  {scanning ? "Scanning" : scanError ? "Error" : <><Check size={12} /> Scanned</>}
                </span>
                <button type="button" onClick={resetAll} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black/30 hover:text-charcoal-2 cursor-pointer"><X size={14} /></button>
              </div>

              {/* Extraction Panel */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.06] animate-fade-in">
                {/* panel header */}
                <div className={`flex items-center gap-2.5 px-4 py-3 border-b text-[13px] font-semibold ${scanError ? "bg-red-light border-red-soft/30 text-red-soft" : "bg-black/[0.015] border-black/[0.06] text-charcoal-2"}`}>
                  <ScanText size={16} className={scanning ? "text-amber" : scanError ? "text-red-soft" : "text-sage"} />
                  {scanning ? "Extracting your notes…" : scanError ? "Extraction failed" : "Extracted Notes — Edit Below"}
                  {!scanning && !scanError && (
                    <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-muted-text"><Check size={14} className="text-sage" /> AI-extracted · editable</span>
                  )}
                </div>

                {/* skeletons */}
                {scanning && (
                  <div className="p-4 space-y-6">
                    {[37, 50, 42, 58, 65].map((w, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3.5 rounded animate-shimmer" style={{ width: `${w}%` }} />
                        <div className="rounded animate-shimmer" style={{ height: `${74 + i * 4}px` }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* error */}
                {scanError && (
                  <div className="flex items-start gap-3 p-4 bg-red-light text-red-soft text-[13px] leading-snug">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    Could not read the notes. Please ensure the image is clear and well-lit, then try again.
                  </div>
                )}

                {/* editors */}
                {sectionsReady && SECTIONS.map((s) => (
                  <WysiwygField
                    key={s.key}
                    label={s.label}
                    icon={<s.icon size={12} />}
                    iconBg={s.iconBg}
                    iconFg={s.iconFg}
                    labelColor={s.labelColor}
                    placeholder={s.ph}
                    htmlValue={sectionHtml[s.key]}
                    onChange={(h) => setSectionHtml(prev => ({ ...prev, [s.key]: h }))}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ══════ Separator ══════ */}
        <hr className="border-t border-black/[0.06]" />

        {/* ══════ PART 2 — Supporting Documents ══════ */}
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ochre-pale text-ochre"><FolderOpen size={20} /></div>
            <div>
              <h2 className="text-base font-semibold text-ink leading-snug flex items-center gap-2">
                Supporting Documents
                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-text">Optional — Max 2</span>
              </h2>
              <p className="mt-1 text-xs text-muted-text leading-relaxed">Upload student records to improve AI accuracy. Select the document type.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-ochre-pale/60 border border-ochre/10 px-3 py-2 mb-4 text-xs text-ochre">
            <Info size={14} className="shrink-0" />
            Accepted: NCAE Results, Report Card, or NAT Results — as PDF or photo
          </div>

          <div className="space-y-3">
            <FileSlot index={1} file={slotFiles[1]} docType={slotTypes[1]} excludeTypes={slotTypes[2] ? [slotTypes[2]] : []} onFileChange={(f) => setSlotFiles(p => ({ ...p, 1: f }))} onTypeChange={(t) => setSlotTypes(p => ({ ...p, 1: t }))} />
            <FileSlot index={2} file={slotFiles[2]} docType={slotTypes[2]} excludeTypes={slotTypes[1] ? [slotTypes[1]] : []} onFileChange={(f) => setSlotFiles(p => ({ ...p, 2: f }))} onTypeChange={(t) => setSlotTypes(p => ({ ...p, 2: t }))} />
          </div>
        </div>

        {/* ══════ PART 3 — Analyze Button ══════ */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <button
            type="button"
            disabled={!canAnalyze}
            onClick={beginAnalysis}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal py-4 text-[15px] font-semibold text-white transition-colors hover:bg-sage disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles size={18} className={canAnalyze ? "animate-pulse group-hover:animate-spin" : ""} />
            Begin Multi Agent Analysis
          </button>
          <p className="mt-3 text-center text-xs font-medium text-muted-text">
            {sectionsReady && !hasDocs ? <><span className="text-sage">Notes extracted!</span> Add supporting documents for a more accurate analysis (optional)</> :
             sectionsReady && hasDocs  ? <span className="text-sage">All inputs ready. Click above to begin the analysis.</span> :
             helperText}
          </p>
        </div>
      </div>

      {/* ══════ Loading Overlay ══════ */}
      {analyzing && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream/90 backdrop-blur-lg p-6 text-center">
          <div className="w-full max-w-[400px] animate-fade-in">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg text-sage">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">{OVERLAY_STEPS[Math.min(analyzeStep - 1, 6)].title}</h3>
            <p className="text-sm text-muted-text mb-8">{OVERLAY_STEPS[Math.min(analyzeStep - 1, 6)].sub}</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {["Labor Market", "Feasibility", "Labor Demand"].map((name, i) => (
                <span key={name} className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${analyzeStep >= i + 4 ? "border-sage bg-sage/[0.06] text-sage" : "border-black/10 bg-white text-black/25"}`}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}