import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNewSession(sessionId: string | null) {
    const router = useRouter();

    const onNewSession = useCallback(() => {
        if (sessionId) {
            // Clear all keys for this session
            sessionStorage.removeItem(`kumpas-session-${sessionId}`);
            sessionStorage.removeItem(`kumpas-structured-${sessionId}`);
            sessionStorage.removeItem(`kumpas-report-${sessionId}`);
            sessionStorage.removeItem(`kumpas-agent-data-${sessionId}`);
        }
        router.push("/");
    }, [sessionId, router]);

    return { onNewSession };
}