import { NextRequest, NextResponse } from "next/server";
import { getSystemInstructions } from "@/lib/server-utils";
import { extractDocumentData } from "@/lib/llm";

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert to base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        // Map common file types to MIME types acceptable by Gemini
        let mimeType = file.type;
        if (!mimeType) {
            if (file.name.endsWith(".pdf")) mimeType = "application/pdf";
            else if (file.name.endsWith(".png")) mimeType = "image/png";
            else if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) mimeType = "image/jpeg";
            else mimeType = "application/octet-stream";
        }

        const parts = [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            {
                text: "Extract the data from this document."
            }
        ];

        const apiKey = process.env.TRANSCRIPTION_LAYER_API_KEY || "";
        const systemPrompt = getSystemInstructions('assessment_extraction.md');
        const parsedData = await extractDocumentData(
            systemPrompt,
            parts,
            apiKey
        );

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("Process Assessment API Error:", error);
        return NextResponse.json(
            { error: `Extraction failed: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
