import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, Card, LinkButton, Notice } from "@/components/ui-kit";
import { CANDIDATE, RECRUITMENTS, languageLabel } from "@/lib/demo-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/booking-confirmed")({
  head: () => ({
    meta: [
      { title: "Interview slot confirmed — Prarambh" },
      { name: "description", content: "Your AI pre-interview slot is confirmed with date, time and language details." },
      { property: "og:title", content: "Interview slot confirmed — Prarambh" },
      { property: "og:description", content: "Add a reminder and read the interview instructions before you begin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const state = useAppState();
  const recruitment = RECRUITMENTS.find((r) => r.id === state.recruitmentId) ?? RECRUITMENTS[0]!;

  return (
    <CandidateShell title="Slot confirmed" back="/home">
      <div className="flex flex-col items-center py-4 text-center">
        <span aria-hidden className="grid size-16 place-items-center rounded-full bg-success-soft text-2xl text-success">
          ✓
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Interview slot confirmed</h1>
        <p className="mt-1 text-sm text-muted-foreground">You will receive a reminder one hour before the interview.</p>
      </div>

      <Card>
        <dl className="space-y-2.5 text-sm">
          {[
            ["Date", state.booking?.date ?? "—"],
            ["Time", state.booking?.time ?? "—"],
            ["Language", languageLabel(state.language)],
            ["Recruitment", recruitment.organisation],
            ["Post", recruitment.post],
            ["Application ID", CANDIDATE.applicationId],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-border pb-2.5 last:border-0 last:pb-0">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="mt-4 space-y-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => alert("Reminder added to your device calendar (prototype).")}
        >
          Add reminder
        </Button>
        <LinkButton to="/system-check" size="lg" className="w-full">
          View interview instructions
        </LinkButton>
        <Notice tone="warning" title="Video mode is compulsory">
          Camera and microphone access are required for this interview.
        </Notice>
      </div>
    </CandidateShell>
  );
}
