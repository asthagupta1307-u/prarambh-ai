import { useSyncExternalStore } from "react";
import { CANDIDATE, type LanguageCode } from "./demo-data";
import type { DimensionScore } from "./ai-service";

export interface AppState {
  language: LanguageCode;
  loggedIn: boolean;
  mobile: string;
  rollNumber: string;
  recruitmentId: string;
  booking: { date: string; time: string } | null;
  systemCheckPassed: boolean;
  interviewCompleted: boolean;
  transcripts: { question: string; category: string; answer: string }[];
  assessment: { dimensions: DimensionScore[]; overall: number } | null;
  shortlisted: boolean | null;
  integrityLog: { time: string; message: string; level: "info" | "warning" }[];
  blindReview: boolean;
}

const KEY = "prarambh-state-v1";

const initial: AppState = {
  language: "en",
  loggedIn: false,
  mobile: "",
  rollNumber: "",
  recruitmentId: CANDIDATE.recruitmentId,
  booking: null,
  systemCheckPassed: false,
  interviewCompleted: false,
  transcripts: [],
  assessment: null,
  shortlisted: null,
  integrityLog: [],
  blindReview: true,
};

let state: AppState = initial;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    /* ignore */
  }
}

function emit() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

export function setState(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  emit();
}

export function resetState() {
  state = initial;
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return state;
    },
    () => initial,
  );
}
