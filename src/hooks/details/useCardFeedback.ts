import { useState, useRef, useCallback } from "react";

export interface FeedbackState {
  text: string;
  tone: "success" | "danger" | "info";
}

export function useCardFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timeout = useRef<number | null>(null);

  const scheduleFeedback = useCallback((next: FeedbackState) => {
    setFeedback(next);

    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = window.setTimeout(() => {
      setFeedback(null);
    }, 3500);
  }, []);

  return {
    feedback,
    scheduleFeedback,
  };
}
