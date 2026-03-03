"use client";

import { useRef } from "react";
import { Upload, Check, X, FileText } from "lucide-react";
import { FileSlotProps } from "@/types";

const ALL_TYPES = [
  { value: "ncae", label: "NCAE Result" },
  { value: "report_card", label: "Report Card" },
  { value: "nat", label: "NAT Result" },
];

const TYPE_LABEL: Record<string, string> = {
  ncae: "NCAE Result", report_card: "Report Card", nat: "NAT Result",
};
const TYPE_COLOR: Record<string, { bg: string; fg: string }> = {
  ncae: { bg: "#D4E6D4", fg: "#3D6B3D" },
  report_card: { bg: "#F5E6CC", fg: "#8B6914" },
  nat: { bg: "#DBEAFE", fg: "#1E40AF" },
};

export default function FileSlot({ index, file, docType, excludeTypes = [], onFileChange, onTypeChange }: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) { onFileChange(null); if (inputRef.current) inputRef.current.value = ""; return; }
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") return;
    onFileChange(f);
  };

  const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  // Filter out types already used by other slot (but always keep the currently selected one)
  const availableTypes = ALL_TYPES.filter(t => t.value === docType || !excludeTypes.includes(t.value));

  return (
    <div className={`rounded-xl border bg-white overflow-hidden transition-colors ${file ? "border-sage" : "border-black/[0.08]"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-black/[0.015]">
        <div className="flex items-center gap-2 sm:min-w-[100px]">
          <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold ${file ? "bg-sage text-white" : "bg-black/[0.06] text-charcoal-3"}`}>
            {file ? <Check size={13} /> : index}
          </span>
          <span className="text-[13px] font-semibold text-charcoal-2">Document {index}</span>
        </div>

        <div className="flex w-full sm:flex-1 items-center gap-2">
          <select
            className="flex-1 w-0 min-w-0 rounded-md border border-black/[0.1] bg-white px-2.5 py-1.5 text-[13px] text-charcoal-2 outline-none focus:border-sage"
            value={docType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">Select type…</option>
            {availableTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {!file && (
            <button
              type="button"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-black/[0.1] bg-white px-3 py-1.5 text-xs font-medium text-charcoal-2 transition-colors hover:bg-black/[0.02] cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} /> Upload
            </button>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />

      {/* Preview */}
      {file && (
        <div className="flex items-center gap-3 border-t border-black/[0.06] p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/[0.04] text-charcoal-3"><FileText size={18} /></div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{file.name}</p>
            <p className="text-[11px] text-muted-text">{fmtSize(file.size)}</p>
          </div>
          {docType && TYPE_LABEL[docType] && (
            <span className="rounded px-2 py-0.5 text-[11px] font-semibold" style={{ background: TYPE_COLOR[docType]?.bg, color: TYPE_COLOR[docType]?.fg }}>
              {TYPE_LABEL[docType]}
            </span>
          )}
          <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full text-black/30 hover:bg-black/5 hover:text-charcoal-2 cursor-pointer" onClick={() => handleFile(null)}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
