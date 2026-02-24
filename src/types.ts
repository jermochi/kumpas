export type TranscriptionState = 
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; text: string }
    | { status: "error"; message: string };
