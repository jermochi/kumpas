"use client";

import { useState, useRef, useEffect } from "react";
import {
    Shield,
    ChevronDown,
    FileText,
    Lock,
    Eye,
    Trash2,
    Mail,
    Share2,
    UserCheck,
    Building2,
    ArrowRight,
} from "lucide-react";

const SECTIONS = [
    {
        id: "overview",
        icon: Shield,
        title: "Overview",
        content: `Kumpas is a career guidance system designed to help Filipino students make informed decisions about their futures. In the course of providing this service, we collect and process certain personal information about students.

This Privacy Policy explains what data we collect, why we collect it, how it is used, and the rights students and their guardians have under Republic Act No. 10173, also known as the Data Privacy Act of 2012 (DPA), and its Implementing Rules and Regulations.

By using Kumpas, the student and/or their authorized guardian acknowledges that they have read, understood, and agreed to this policy.`
    },
    {
        id: "controller",
        icon: Building2,
        title: "Personal Information Controller",
        content: `The school or institution deploying Kumpas acts as the Personal Information Controller (PIC) for the student data processed through this system. Kumpas (the platform) acts as a Personal Information Processor (PIP) on behalf of the school.

As the PIC, the school is responsible for:
- Ensuring student data is collected with proper consent
- Determining the lawful basis for processing
- Ensuring data is used only for career guidance purposes
- Responding to student and guardian data subject requests

The school's Data Protection Officer (DPO) is the primary point of contact for all data privacy concerns related to this system.`
    },
    {
        id: "what-we-collect",
        icon: Eye,
        title: "What Data We Collect",
        content: `Kumpas collects only the minimum personal data necessary to deliver accurate career guidance. This includes:

STUDENT PERSONAL INFORMATION
- Name, age, and grade level
- Senior High School strand or track
- Academic performance signals (grades, subject strengths/weaknesses)
- Region or province of residence
- General financial situation (income level, scholarship status)

COUNSELOR SESSION NOTES
- Notes typed by the guidance counselor during or after the session
- Career interests, aspirations, and stated goals as reported by the student
- Family context and dynamics as relevant to career guidance
- Optional academic documents uploaded by the counselor: Report Card, NCAE Results, or NAT Results

WHAT WE DO NOT COLLECT
- Audio or video recordings of counseling sessions
- Biometric data of any kind
- Social media accounts or online activity
- Medical records or clinical diagnoses`
    },
    {
        id: "how-we-use",
        icon: Lock,
        title: "How We Use Your Data",
        content: `Data collected through Kumpas is used solely for the following purposes:

1. CAREER GUIDANCE ANALYSIS
Session notes and academic documents are processed by Kumpas's AI agents to generate a structured career assessment covering labor market fit, academic feasibility, and psychological alignment.

2. REPORT GENERATION
A Career Assessment Report is generated for use by the guidance counselor in their session with the student. This report is not shared with third parties without consent.

3. SYSTEM IMPROVEMENT & RESEARCH
Anonymized, aggregated data (no personally identifiable information) may be used to improve the accuracy and relevance of the Kumpas system, and may be shared with partner schools and research institutions for educational research purposes.

LEGAL BASIS FOR PROCESSING
Processing is carried out on the basis of:
- Consent — the student or guardian has given express consent (Section 12(a), RA 10173)
- Legitimate purpose — career guidance is a core educational function (Section 12(b), RA 10173)
- Proportionality — only data necessary for guidance is collected and processed`
    },
    {
        id: "data-sharing",
        icon: Share2,
        title: "Data Sharing",
        content: `Kumpas may share data with third parties only in the limited circumstances described below. We do not sell personal data.

WHO WE SHARE DATA WITH
- Partner schools and educational institutions — to support network-wide career guidance research and program evaluation
- Research institutions and academic organizations — for peer-reviewed studies on career outcomes, labor market alignment, and educational planning
- Government agencies (e.g., CHED, DepEd, TESDA) — where required by law or in support of national education policy research

WHAT IS SHARED
Only anonymized, aggregated data is shared with external parties. This means:
- All personal identifiers (names, student numbers, school names, specific locations) are removed
- Data is aggregated across multiple students so that no individual can be identified
- Raw session notes, uploaded documents, and individual career reports are never shared

OPT-OUT
Students and guardians may opt out of having their anonymized data included in external sharing at any time by submitting a written request to the school's Data Protection Officer. Opting out does not affect access to the Kumpas career guidance service.

LEGAL BASIS
External data sharing is conducted on the basis of consent and legitimate educational research purpose under Section 12 of RA 10173. Data processing agreements are in place with all external recipients.`
    },
    {
        id: "storage",
        icon: Shield,
        title: "Data Storage & Retention",
        content: `DATA STORAGE
Student data processed through Kumpas is handled with the following safeguards:
- Session notes and uploaded documents are processed in-session and are not permanently stored on Kumpas servers beyond what is necessary to generate the report
- Personal identifiers (names, specific locations) are removed from data passed to AI processing components
- All data in transit is encrypted using industry-standard protocols (TLS 1.2+)

DATA RETENTION
- Generated reports are retained for the duration of the student's enrollment at the institution, or as specified by the school's data retention policy
- Raw session notes are subject to the school's own document retention rules
- Upon written request, student data will be deleted within 30 calendar days

DATA LOCALIZATION
Kumpas complies with the NPC's guidelines on cross-border data transfers. Where AI processing components operate on servers outside the Philippines, appropriate safeguards are in place in accordance with NPC Circular No. 16-01.`
    },
    {
        id: "rights",
        icon: UserCheck,
        title: "Your Rights as a Data Subject",
        // Special rendering: pairs of right-name + description
        rights: [
            { name: "Right to Be Informed", desc: "You have the right to know what personal data is collected, why, and how it will be used — which is the purpose of this document." },
            { name: "Right to Access", desc: "Request a copy of the personal data Kumpas holds about the student at any time via the school's DPO." },
            { name: "Right to Rectification", desc: "If any personal data is inaccurate or incomplete, you may request it be corrected." },
            { name: "Right to Erasure / Blocking", desc: "Request deletion or blocking of personal data if collected unlawfully, no longer necessary, or consent is withdrawn." },
            { name: "Right to Object", desc: "Object to the processing of personal data for purposes other than those stated in this policy." },
            { name: "Right to Data Portability", desc: "Request a copy of your data in a structured, commonly used and machine-readable format." },
            { name: "Right to File a Complaint", desc: "File a complaint with the National Privacy Commission at complaints@privacy.gov.ph or privacy.gov.ph if your rights are violated." },
        ],
        content: ``
    },
    {
        id: "security",
        icon: Lock,
        title: "Security Measures",
        content: `Kumpas implements appropriate technical and organizational measures to protect student data:

TECHNICAL SAFEGUARDS
- Encryption of data in transit (TLS) and at rest
- PII removal before data is passed to AI processing components — names, specific schools, and precise locations are replaced with anonymized tokens
- Access controls ensuring only authorized counselors can view session data
- No audio or video recording capability — all input is text-based to protect student privacy during sessions

ORGANIZATIONAL SAFEGUARDS
- Counselors are trained on data handling responsibilities under RA 10173
- Data processing is limited to career guidance purposes only
- Third-party AI service providers are bound by data processing agreements

BREACH NOTIFICATION
In the event of a personal data breach, affected individuals and the National Privacy Commission will be notified within 72 hours of discovery, in accordance with NPC Circular No. 16-03.`
    },
    {
        id: "contact",
        icon: Mail,
        title: "Contact & Complaints",
        content: `For questions, requests, or complaints about how Kumpas handles your personal data, please contact:

YOUR SCHOOL'S DATA PROTECTION OFFICER
The school deploying Kumpas is your primary point of contact for all data subject requests.

NATIONAL PRIVACY COMMISSION (NPC)
National Privacy Commission
5th Floor, Delegation Building
PICC Complex, Roxas Boulevard
Pasay City, Metro Manila 1307

Email: complaints@privacy.gov.ph
Website: privacy.gov.ph
Hotline: (02) 8234-2228

This Privacy Policy was last reviewed in 2025 and will be updated as necessary to reflect changes in Kumpas's data practices or applicable law.`
    }
];

type Section = typeof SECTIONS[0];

/** Parse a freeform content string into typed render blocks */
function parseContent(content: string) {
    if (!content.trim()) return [];
    return content.split("\n\n").map((block, i) => {
        const trimmed = block.trim();
        // ALL-CAPS standalone heading
        if (/^[A-Z0-9][A-Z0-9\s\/\(\)\.\-']+$/.test(trimmed) && trimmed.length < 80 && !trimmed.includes("\n")) {
            return { type: "heading" as const, text: trimmed, key: i };
        }
        // Numbered item: "1. LABEL\nBody text"
        if (/^\d+\.\s+[A-Z]/.test(trimmed)) {
            const newlineIdx = trimmed.indexOf("\n");
            const firstLine = newlineIdx === -1 ? trimmed : trimmed.slice(0, newlineIdx);
            const body = newlineIdx === -1 ? "" : trimmed.slice(newlineIdx + 1).trim();
            const dotIdx = firstLine.indexOf(". ");
            const num = firstLine.slice(0, dotIdx);
            const label = firstLine.slice(dotIdx + 2);
            return { type: "numbered" as const, num, label, body, key: i };
        }
        // Bullet list — lines starting with "- "
        if (trimmed.includes("\n-") || trimmed.startsWith("- ")) {
            const lines = trimmed.split("\n");
            const intro = lines[0].startsWith("-") ? null : lines[0];
            const items = lines.filter(l => l.startsWith("- ")).map(l => l.slice(2));
            return { type: "list" as const, intro, items, key: i };
        }
        return { type: "paragraph" as const, text: trimmed, key: i };
    });
}

function RenderBlocks({ blocks }: { blocks: ReturnType<typeof parseContent> }) {
    return (
        <div className="space-y-3">
            {blocks.map((block) => {
                if (block.type === "heading") {
                    return (
                        <div key={block.key} className="flex items-center gap-2 pt-4 first:pt-0">
                            <span className="h-px flex-1 bg-forest/10" />
                            <p className="text-[9.5px] font-black uppercase tracking-[0.15em] text-forest/70 shrink-0">
                                {block.text}
                            </p>
                            <span className="h-px flex-1 bg-forest/10" />
                        </div>
                    );
                }
                if (block.type === "numbered") {
                    return (
                        <div key={block.key} className="rounded-xl border border-black/[0.06] bg-black/[0.015] px-4 py-3.5">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-[9px] font-black tabular-nums text-forest/50 shrink-0 border border-forest/20 rounded px-1 py-0.5">{block.num}</span>
                                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink/70">{block.label}</p>
                            </div>
                            {block.body && <p className="text-sm leading-relaxed text-justify text-ink/65 pl-6">{block.body}</p>}
                        </div>
                    );
                }
                if (block.type === "list") {
                    return (
                        <div key={block.key}>
                            {block.intro && <p className="text-sm leading-relaxed text-justify text-ink/70 mb-2">{block.intro}</p>}
                            <ul className="space-y-1.5">
                                {block.items.map((item, j) => (
                                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                                        <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-forest/40" />
                                        <span className="text-justify">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                return (
                    <p key={block.key} className="text-sm leading-relaxed text-justify text-ink/70">
                        {block.text}
                    </p>
                );
            })}
        </div>
    );
}

/** Special grid layout for "Your Rights" section */
function RightsGrid({ rights }: { rights: NonNullable<Section["rights"]> }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rights.map((right, i) => (
                <div key={i} className="rounded-xl border border-black/[0.07] bg-black/[0.015] p-4 flex flex-col gap-1.5">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-forest">{right.name}</p>
                    <p className="text-sm leading-relaxed text-justify text-ink/65">{right.desc}</p>
                </div>
            ))}
        </div>
    );
}

function AccordionItem({
    section,
    index,
    isOpen,
    onToggle,
}: {
    section: Section;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const Icon = section.icon;
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        // Use ResizeObserver so height updates if content reflows
        const ro = new ResizeObserver(() => {
            if (isOpen) setHeight(el.scrollHeight);
        });
        ro.observe(el);
        setHeight(isOpen ? el.scrollHeight : 0);
        return () => ro.disconnect();
    }, [isOpen]);

    const blocks = parseContent(section.content);

    return (
        <div
            className={`rounded-2xl border transition-all duration-300 ${isOpen
                ? "border-forest/30 bg-white shadow-[0_8px_32px_rgba(107,143,113,0.12)]"
                : "border-black/[0.07] bg-white hover:border-forest/20 hover:shadow-[0_2px_12px_rgba(107,143,113,0.07)]"
                }`}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 px-6 py-5 text-left cursor-pointer group/btn"
            >
                {/* Index */}
                <span
                    className={`shrink-0 font-heading text-base tabular-nums w-7 leading-none transition-colors duration-200 ${isOpen ? "text-forest" : "text-black/15"
                        }`}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon chip */}
                <div
                    className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${isOpen
                        ? "bg-forest text-white shadow-sm"
                        : "bg-forest/[0.07] text-forest group-hover/btn:bg-forest/[0.12]"
                        }`}
                >
                    <Icon size={15} strokeWidth={2} />
                </div>

                <span className={`flex-1 text-sm font-semibold transition-colors duration-200 ${isOpen ? "text-ink" : "text-ink/80"}`}>
                    {section.title}
                </span>

                <div
                    className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-forest/10 rotate-180" : "bg-black/[0.04] rotate-0"
                        }`}
                >
                    <ChevronDown size={13} className={`transition-colors duration-200 ${isOpen ? "text-forest" : "text-muted-text"}`} />
                </div>
            </button>

            {/* Animated body */}
            <div style={{ height, overflow: "hidden", transition: "height 0.38s cubic-bezier(0.4,0,0.2,1)" }}>
                <div ref={contentRef}>
                    {/* Divider */}
                    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-forest/15 to-transparent" />

                    <div className="px-8 pb-8 pt-5">
                        <div className="pl-[4.25rem]">
                            {section.rights ? (
                                <RightsGrid rights={section.rights} />
                            ) : (
                                <RenderBlocks blocks={blocks} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PrivacyPage() {
    const [openSection, setOpenSection] = useState<string | null>("overview");
    const navRef = useRef<HTMLDivElement>(null);

    // Toggle from accordion header
    const toggle = (id: string) => setOpenSection(prev => prev === id ? null : id);

    // Navigate from nav pill: open section + scroll into view
    const navigateTo = (id: string) => {
        setOpenSection(id);
        // Use setTimeout so React's DOM update has flushed before we measure.
        // Also sum ALL sticky elements (global nav + section nav) for the offset.
        setTimeout(() => {
            const el = document.getElementById(`section-${id}`);
            if (!el) return;
            const stickyOffset = Array.from(
                document.querySelectorAll<HTMLElement>("[class*='sticky']")
            ).reduce((sum, node) => sum + node.offsetHeight, 0);
            const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset - 12;
            window.scrollTo({ top, behavior: "smooth" });
        }, 50);
    };

    // Auto-scroll the active nav pill into view
    useEffect(() => {
        if (!openSection || !navRef.current) return;
        const pill = navRef.current.querySelector(`[data-pill="${openSection}"]`) as HTMLElement | null;
        pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [openSection]);

    return (
        <div className="min-h-screen bg-background font-sans">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-white border-b border-black/[0.06]">
                {/* Dot-grid texture */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(107,143,113,0.25) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                {/* Radial fade over texture */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 70% 100% at 50% 0%, white 0%, transparent 100%)"
                    }}
                />
                {/* Right-side green glow */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 50% 90% at 105% 50%, rgba(107,143,113,0.08) 0%, transparent 70%)",
                    }}
                />

                <div className="relative mx-auto max-w-5xl px-8 py-14 sm:py-20">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest/25 bg-forest/[0.06] px-3.5 py-1.5">
                        <Shield size={11} className="text-forest" strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-forest">RA 10173 · DPA 2012 Compliant</span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
                        Student Data<br />
                        <span className="text-forest">Privacy Policy</span>
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-text">
                        Kumpas is committed to protecting your personal data.
                        This policy outlines your rights under the{" "}
                        <span className="font-semibold text-ink">Data Privacy Act of 2012</span>.
                    </p>

                    {/* Info cards */}
                    <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                        {[
                            { label: "Governing Law", value: "RA 10173 (DPA 2012)" },
                            { label: "Regulator", value: "National Privacy Commission" },
                            { label: "Data Use", value: "Career guidance only" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl border border-black/[0.07] bg-black/[0.02] px-4 py-3.5 backdrop-blur-sm"
                            >
                                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.14em] text-muted-text">{item.label}</p>
                                <p className="text-sm font-semibold text-ink">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Sticky section nav ─────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-black/[0.05] bg-background/95 backdrop-blur-sm" ref={navRef}>
                <div className="mx-auto max-w-5xl px-8">
                    <div className="flex gap-1.5 overflow-x-auto py-3 no-scrollbar">
                        {SECTIONS.map((s, i) => {
                            const Icon = s.icon;
                            const active = openSection === s.id;
                            return (
                                <button
                                    key={s.id}
                                    data-pill={s.id}
                                    onClick={() => navigateTo(s.id)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold transition-all duration-200 cursor-pointer ${active
                                        ? "bg-forest text-white shadow-sm scale-[1.02]"
                                        : "bg-white/80 text-muted-text hover:bg-white hover:text-ink border border-black/[0.08]"
                                        }`}
                                >
                                    <Icon size={10} strokeWidth={2.5} />
                                    <span>{i + 1}. {s.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Accordion list ─────────────────────────────────────── */}
            <div className="mx-auto max-w-5xl px-8 pt-8 pb-4 space-y-2">
                {SECTIONS.map((section, i) => (
                    <div key={section.id} id={`section-${section.id}`}>
                        <AccordionItem
                            section={section}
                            index={i}
                            isOpen={openSection === section.id}
                            onToggle={() => toggle(section.id)}
                        />
                    </div>
                ))}
            </div>

            {/* ── Data deletion CTA ──────────────────────────────────── */}
            <div className="mx-auto max-w-5xl px-8 pb-16 pt-4">
                <div className="relative overflow-hidden rounded-2xl bg-forest px-6 py-6">
                    {/* Subtle inner dot texture */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                        }}
                    />
                    <div className="relative flex gap-4 items-start">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                            <Trash2 size={16} className="text-white" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-semibold text-white mb-1">Request Data Deletion</p>
                            <p className="text-sm leading-relaxed text-white/75">
                                Students and guardians may request deletion of all personal data by contacting
                                the school&apos;s Data Protection Officer. Requests will be fulfilled within{" "}
                                <span className="font-semibold text-white">30 calendar days</span> in accordance
                                with NPC guidelines.
                            </p>
                        </div>
                        <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 self-center">
                            <ArrowRight size={14} className="text-white/70" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`.no-scrollbar{scrollbar-width:none}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        </div>
    );
}