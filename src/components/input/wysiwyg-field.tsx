"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { WysiwygFieldProps } from "@/types";

export default function WysiwygField({
  label, icon, iconBg, iconFg, labelColor,
  placeholder, htmlValue, onChange,
}: WysiwygFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [formats, setFormats] = useState({ bold: false, italic: false, ul: false, ol: false });

  const checkFormats = useCallback(() => {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
    });
  }, []);

  useEffect(() => {
    if (editorRef.current && htmlValue !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = htmlValue;
    }
  }, [htmlValue]);

  const exec = (cmd: string) => { document.execCommand(cmd); checkFormats(); };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  };

  const ToolBtn = ({ active, cmd, children }: { active: boolean; cmd: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
      className={`flex h-[30px] w-[30px] items-center justify-center rounded transition-colors cursor-pointer ${
        active ? "bg-charcoal text-white" : "text-charcoal-3 hover:bg-black/5 hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-black/[0.06] last:border-b-0">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#FDFDFB]">
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded" style={{ background: iconBg, color: iconFg }}>{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: labelColor }}>{label}</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-1.5 bg-white border-b border-black/[0.03]">
        <ToolBtn active={formats.bold} cmd="bold"><Bold size={14} /></ToolBtn>
        <ToolBtn active={formats.italic} cmd="italic"><Italic size={14} /></ToolBtn>
        <span className="mx-1.5 h-4 w-px bg-black/10" />
        <ToolBtn active={formats.ul} cmd="insertUnorderedList"><List size={14} /></ToolBtn>
        <ToolBtn active={formats.ol} cmd="insertOrderedList"><ListOrdered size={14} /></ToolBtn>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className="min-h-[80px] px-4 py-3.5 text-sm leading-relaxed text-charcoal-2 outline-none bg-white [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-black/25 [&:empty]:before:pointer-events-none [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-ink [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:marker:text-ink [&_p]:mb-1 [&_p:last-child]:mb-0"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={checkFormats}
        onMouseUp={checkFormats}
        onSelect={checkFormats}
      />
    </div>
  );
}
