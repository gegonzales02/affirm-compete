"use client";

import { useState, useCallback } from "react";
import { CompetitorData } from "./competitors";

interface AnalyzeParams {
  type: "overlap" | "sharpen" | "pulse" | "paste";
  competitor?: string;
  audience?: string;
  affirmData?: CompetitorData;
  competitorData?: CompetitorData;
  allCompetitors?: Record<string, CompetitorData>;
  pastedContent?: string;
  source?: string;
}

export function useAnalyze() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (params: AnalyzeParams) => {
    setOutput("");
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setOutput(accumulated);
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  return { output, isStreaming, error, analyze, reset };
}
