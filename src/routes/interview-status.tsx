import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Notice, Pill, SectionTitle } from "@/components/ui-kit";
import { RECRUITMENTS, languageLabel } from "@/lib/demo-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/interview-status")({
  head: () => ({
    meta: [
      { title: "Interview status — Prarambh" },
      { name: "description", content: "Your AI pre-interview booking, readiness checks and assessment status." },
      { property: "og:title", content: "Interview status — Prarambh" },
      { property: "og:description", content: "See whether your interview is booked, completed or assessed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InterviewStatus,
});

function InterviewStatus() {
  const state = useAppState();
  const recruitment = RECRUITMENTS.find((r) => r.id === state.recruitmentId) ?? RECRUITMENTS[0]!;

  return (
    <CandidateShell title="Interview status" back="/home">
      <h1 className="text-xl font-bold text-foreground">AI pre-interview status</h1>
      <div className="mt-3">
        <DemoBadge label="Demo Data" />
      </div>

      <Card className="mt-4">
        <SectionTitle>Booking</SectionTitle>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Pill tone={state.interviewCompleted ? "success" : state.booking ? "info" : "warning"}>
                {state.interviewCompleted ? "Completed" : state.booking ? "Scheduled" : "Not booked"}
              </Pill>
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Slot</dt>
            <dd className="font-medium text-foreground">
              {state.booking ? `${state.booking.date} · ${state.booking.time}` : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Language</dt>
            <dd className="font-medium text-foreground">{languageLabel(state.language)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-medium text-foreground">{recruitment.interviewDuration}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">System check</dt>
            <dd className="font-medium text-foreground">{state.systemCheckPassed ? "Passed" : "Not run"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Assessment</dt>
            <dd className="font-medium text-foreground">
              {state.assessment ? `Completed · overall ${state.assessment.overall}` : "Pending"}
            </dd>
          </div>
        </dl>
      </Card>

      {state.integrityLog.length > 0 && (
        <Card className="mt-3">
          <SectionTitle>Interview integrity events</SectionTitle>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {state.integrityLog.map((e, i) => (
              <li key={`${e.time}-${i}`}>
                <span className="font-medium text-foreground">{e.time}</span> — {e.message}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-4 space-y-3">
        {state.interviewCompleted ? (
          <LinkButton to="/result" size="lg" className="w-full">
            View result
          </LinkButton>
        ) : state.booking ? (
          <LinkButton to="/system-check" size="lg" className="w-full">
            Prepare for your interview
          </LinkButton>
        ) : (
          <LinkButton to="/book" size="lg" className="w-full">
            Book interview slot
          </LinkButton>
        )}
        <Notice tone="info" title="AI-assisted assessment — Human review required">
          AI-generated scores are recommendations for authorised human reviewers. No final recruitment decision is made
          by AI alone.
        </Notice>
      </div>
    </CandidateShell>
  );
}
