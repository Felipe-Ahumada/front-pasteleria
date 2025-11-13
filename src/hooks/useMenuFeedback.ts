import { useRef, useState, useEffect } from "react";

type FeedbackState = {
  text: string;
  tone: "success" | "danger" | "info";
};

export const useMenuFeedback = () => {
  const [cardFeedbacks, setCardFeedbacks] = useState<
    Record<string, FeedbackState | null>
  >({});
  const timeouts = useRef<Record<string, number | null>>({});

  const scheduleCardFeedback = (code: string, feedback: FeedbackState) => {
    setCardFeedbacks((prev) => ({ ...prev, [code]: feedback }));

    if (timeouts.current[code])
      clearTimeout(timeouts.current[code]!);

    timeouts.current[code] = window.setTimeout(() => {
      setCardFeedbacks((prev) => ({ ...prev, [code]: null }));
      timeouts.current[code] = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach((id) => id && clearTimeout(id));
    };
  }, []);

  return { cardFeedbacks, scheduleCardFeedback };
};
