/**
 * AIService abstraction layer.
 *
 * Every AI capability used by the prototype goes through this layer so that a
 * real provider (Google / Azure / AWS / Whisper-compatible / Lovable AI) can be
 * plugged in later without touching UI code. In prototype mode the services use
 * browser speech APIs where available and deterministic mock responses otherwise.
 */

import {
  ASSESSMENT_DIMENSIONS,
  QUESTION_FRAMEWORK,
  type InterviewQuestion,
  type LanguageCode,
} from "./demo-data";

export const AI_MODE: "prototype" = "prototype";

/* ---------------------------------- Interview ---------------------------------- */

export const InterviewService = {
  /** Standardised question set for a recruitment — identical for all candidates on a role. */
  getQuestionSet(recruitmentId: string): InterviewQuestion[] {
    void recruitmentId;
    return QUESTION_FRAMEWORK;
  },
  questionText(q: InterviewQuestion, lang: LanguageCode): string {
    return q.text[lang] ?? q.text.en;
  },
};

/* ----------------------------------- Speech ------------------------------------ */

const BCP47: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  or: "or-IN",
  pa: "pa-IN",
};

const MOCK_TRANSCRIPTS = [
  "In my previous project I coordinated with three teams to deliver a citizen grievance module. I began by mapping the responsibilities of each team, agreed on a shared timeline, and reviewed progress every week.",
  "I would first look at the error logs to identify where submissions are failing, then check whether the issue is with the form validation or the backend service, and finally publish a status update for citizens.",
  "Public service delivery should be simple enough that a citizen can complete it without assistance. I would design for low bandwidth, offer regional languages, and keep offline service counters available.",
];

export const SpeechService = {
  supported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition,
    );
  },

  /** Text-to-Speech — speaks the AI interviewer question in the selected language. */
  speak(text: string, lang: LanguageCode): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = BCP47[lang];
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      /* provider unavailable in prototype mode */
    }
  },

  stopSpeaking(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    }
  },

  /**
   * Speech-to-Text. Returns a stop() handle. Uses the browser recogniser when
   * available, otherwise streams a mock transcript so the flow still demos.
   */
  listen(
    lang: LanguageCode,
    onPartial: (text: string) => void,
    onFinal: (text: string) => void,
  ): () => void {
    const Rec =
      typeof window !== "undefined"
        ? ((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
            .SpeechRecognition ||
            (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
        : undefined;

    if (Rec) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rec = new (Rec as any)();
      rec.lang = BCP47[lang];
      rec.continuous = true;
      rec.interimResults = true;
      let full = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const chunk = event.results[i][0].transcript as string;
          if (event.results[i].isFinal) full += chunk + " ";
          else interim += chunk;
        }
        onPartial((full + interim).trim());
      };
      rec.onerror = () => undefined;
      try {
        rec.start();
      } catch {
        /* already started */
      }
      return () => {
        try {
          rec.stop();
        } catch {
          /* noop */
        }
        onFinal(full.trim() || MOCK_TRANSCRIPTS[0]!);
      };
    }

    // Mock recogniser
    const source = MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)]!;
    const words = source.split(" ");
    let i = 0;
    const timer = setInterval(() => {
      i += 2;
      onPartial(words.slice(0, i).join(" "));
      if (i >= words.length) clearInterval(timer);
    }, 220);
    return () => {
      clearInterval(timer);
      onFinal(words.slice(0, Math.max(i, 8)).join(" "));
    };
  },
};

/* --------------------------------- Translation --------------------------------- */

export const TranslationService = {
  permittedLanguages(allowed: LanguageCode[]): LanguageCode[] {
    return allowed;
  },
  /** Prototype: returns the pre-authored localisation when present. */
  translate(text: string, _lang: LanguageCode): string {
    void _lang;
    return text;
  },
};

/* ------------------------------------ OCR -------------------------------------- */

export const OCRService = {
  extract(documentName: string) {
    return {
      documentName,
      confidence: 0.93,
      fields: [
        { key: "Name", value: "Aarav Sharma" },
        { key: "Document number", value: "XXXX XXXX 4821" },
        { key: "Date of birth", value: "14 Mar 2001" },
      ],
      note: "Prototype OCR output — mock extraction.",
    };
  },
};

/* --------------------------------- Evaluation ---------------------------------- */

export interface DimensionScore {
  dimension: string;
  score: number;
  evidence: string;
}

const EVIDENCE: Record<string, string> = {
  "Role Knowledge": "Candidate correctly identified the key process steps for citizen service delivery.",
  "Problem Solving": "Candidate proposed a diagnostic sequence but did not discuss preventive measures.",
  Communication: "Candidate gave a structured answer and explained the situation clearly.",
  "Situational Judgement": "Candidate balanced urgency with accuracy and escalated appropriately.",
  "Public Service Orientation": "Candidate consistently referred to citizen access and inclusion.",
  "Structured Thinking": "Answers followed a situation–action–result pattern in most responses.",
  "Role-specific Competencies": "Candidate described relevant digital delivery experience with examples.",
};

export const EvaluationService = {
  /** Deterministic rubric scoring from transcripts — same criteria for every candidate. */
  evaluate(transcripts: string[]): { dimensions: DimensionScore[]; overall: number } {
    const base = transcripts.join(" ").trim().length;
    const dimensions = ASSESSMENT_DIMENSIONS.map((dimension, i) => {
      const spread = ((base + i * 37) % 19) - 9;
      const score = Math.max(52, Math.min(95, 80 + spread));
      return { dimension, score, evidence: EVIDENCE[dimension] ?? "Evidence captured from transcript." };
    });
    const overall =
      Math.round((dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length) * 10) / 10;
    return { dimensions, overall };
  },
};

/* ---------------------------------- Feedback ----------------------------------- */

export const FeedbackService = {
  build(dimensions: DimensionScore[]) {
    const advice: Record<string, string> = {
      Communication: "Practice giving structured answers using Situation → Action → Result.",
      "Role Knowledge": "Strengthen your understanding of public-sector digital service delivery.",
      "Problem Solving": "Practice scenario-based questions with a clear diagnosis-to-action sequence.",
      "Situational Judgement": "Review case studies on prioritising urgency against accuracy.",
      "Public Service Orientation": "Study inclusion and last-mile delivery in government programmes.",
      "Structured Thinking": "Outline answers in three parts before speaking.",
      "Role-specific Competencies": "Prepare concrete examples from your own projects.",
    };
    return [...dimensions]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((d) => ({
        dimension: d.dimension,
        score: d.score,
        suggestion: advice[d.dimension] ?? "Practice structured, evidence-based answers.",
        evidence: d.evidence,
      }));
  },
};

/* ---------------------------------- Analytics ---------------------------------- */

export const AnalyticsService = {
  predict(interviewsPerDay: number, pending: number) {
    const days = Math.max(1, Math.ceil(pending / Math.max(1, interviewsPerDay)));
    return { days, note: "Prototype predictive model based on current throughput." };
  },
};

/* ------------------------------ Computer Vision -------------------------------- */

export type IntegrityEvent = { time: string; message: string; level: "info" | "warning" };

export const VisionService = {
  /** Prototype integrity signals — technical quality only, no personal inference. */
  sampleEvent(elapsedSeconds: number): IntegrityEvent | null {
    if (elapsedSeconds === 25)
      return { time: clock(), message: "Please ensure adequate lighting.", level: "info" };
    if (elapsedSeconds === 55)
      return { time: clock(), message: "Please remain visible in the camera frame.", level: "warning" };
    if (elapsedSeconds === 95)
      return { time: clock(), message: "Candidate presence confirmed — monitoring.", level: "info" };
    return null;
  },
};

function clock() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export const AIService = {
  mode: AI_MODE,
  InterviewService,
  SpeechService,
  TranslationService,
  OCRService,
  EvaluationService,
  FeedbackService,
  AnalyticsService,
  VisionService,
};
