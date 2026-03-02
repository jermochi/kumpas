export type TranscriptionState = 
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; text: string }
    | { status: "error"; message: string };

export interface WysiwygFieldProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  labelColor: string;
  placeholder: string;
  htmlValue: string;
  onChange: (html: string) => void;
}

export interface FileSlotProps {
  index: 1 | 2;
  file: File | null;
  docType: string;
  excludeTypes?: string[];
  onFileChange: (file: File | null) => void;
  onTypeChange: (type: string) => void;
}
