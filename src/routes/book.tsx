import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, Card, DemoBadge, Notice, SectionTitle } from "@/components/ui-kit";
import { INTERVIEW_DATES, INTERVIEW_TIMES, RECRUITMENTS, languageLabel } from "@/lib/demo-data";
import { setState, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book your AI interview — Prarambh" },
      { name: "description", content: "Choose a date and time for your standardised AI pre-interview." },
      { property: "og:title", content: "Book your AI interview — Prarambh" },
      { property: "og:description", content: "Interview duration is approximately 12–15 minutes, video mode compulsory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const recruitment = RECRUITMENTS.find((r) => r.id === state.recruitmentId) ?? RECRUITMENTS[0]!;
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!date || !time) {
      setError("Select both a date and a time slot to continue.");
      return;
    }
    const label = INTERVIEW_DATES.find((d) => d.id === date)?.label ?? date;
    setState({ booking: { date: `${label} 2026`, time } });
    navigate({ to: "/booking-confirmed" });
  }

  return (
    <CandidateShell title="Book interview" back="/home">
      <h1 className="text-xl font-bold text-foreground">Book your AI interview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {recruitment.post} · Interview duration: {recruitment.interviewDuration}
      </p>
      <div className="mt-3">
        <DemoBadge label="Demo Data" />
      </div>

      <Card className="mt-4">
        <SectionTitle>Available dates</SectionTitle>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Interview dates">
          {INTERVIEW_DATES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={date === d.id}
              onClick={() => {
                setDate(d.id);
                setError(null);
              }}
              className={`rounded-lg border px-2 py-3 text-center transition-colors ${
                date === d.id ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <span className="block text-sm font-semibold text-foreground">{d.label}</span>
              <span className="block text-[11px] text-muted-foreground">{d.day}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-3">
        <SectionTitle>Time slots</SectionTitle>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Interview time slots">
          {INTERVIEW_TIMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={time === t}
              onClick={() => {
                setTime(t);
                setError(null);
              }}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                time === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        <Notice tone="info" title="Before you book">
          Video mode is compulsory. You will need a camera, a microphone and a quiet space with a stable internet
          connection. Your interview language is {languageLabel(state.language)}.
        </Notice>
        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button size="lg" className="w-full" onClick={confirm}>
          Confirm slot
        </Button>
      </div>
    </CandidateShell>
  );
}
