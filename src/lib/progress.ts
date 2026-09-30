import { BASE_STAGES, type StageInfo } from "./demo-data";
import type { AppState } from "./app-state";

export function buildStages(state: AppState): StageInfo[] {
  return BASE_STAGES.map((stage) => {
    if (stage.key === "interview") {
      if (state.interviewCompleted)
        return { ...stage, status: "completed", date: state.booking?.date ?? "26 Sep 2026", detail: "AI pre-interview completed." };
      if (state.booking)
        return {
          ...stage,
          status: "current",
          date: `${state.booking.date} · ${state.booking.time}`,
          detail: "Slot confirmed. Video mode is compulsory.",
          action: "Join interview",
        };
      return stage;
    }
    if (stage.key === "assessment") {
      if (state.assessment)
        return {
          ...stage,
          status: "completed",
          date: "Completed",
          detail: `AI-assisted assessment generated (overall ${state.assessment.overall}). Human review required.`,
        };
      if (state.interviewCompleted)
        return { ...stage, status: "current", date: "In progress", detail: "Your responses are being assessed." };
      return stage;
    }
    if (stage.key === "shortlist" && state.assessment) {
      return {
        ...stage,
        status: state.shortlisted === null ? "current" : "completed",
        detail:
          state.shortlisted === null
            ? "Awaiting authorised human review."
            : state.shortlisted
              ? "Shortlisted for the final human interview."
              : "Not shortlisted for the next stage.",
      };
    }
    return stage;
  });
}

export function progressPercent(stages: StageInfo[]): number {
  const done = stages.filter((s) => s.status === "completed").length;
  const current = stages.some((s) => s.status === "current") ? 0.5 : 0;
  return Math.round(((done + current) / stages.length) * 100);
}
