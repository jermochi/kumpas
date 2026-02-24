"use client";

import { useState, useCallback } from "react";

export default function useRecordVoice() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const initRecording = useCallback(async () => {
    if (typeof window !== "undefined") {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      return recorder;
    }
    return null;
  }, []);

  const clearRecording = useCallback(() => {
    setMediaRecorder(null);
  }, []);

  return { mediaRecorder, initRecording, clearRecording };
}
