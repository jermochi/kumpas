import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// POST /api/upload — token generation for client-side blob uploads
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = (await request.json()) as HandleUploadBody;

        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                return {
                    maximumSizeInBytes: 20 * 1024 * 1024, // 20MB
                };
            },
            onUploadCompleted: async () => {
                // No-op
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("Upload route error:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
