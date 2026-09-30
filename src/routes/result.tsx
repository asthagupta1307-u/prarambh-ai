import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Notice, Pill, ScoreBar, SectionTitle } from "@/components/ui-kit";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your result & assessment — Prarambh" },
      { name: "description", content: "Transparent AI assessment scores with evidence and your current status." },
      { property: "og:title", content: "Your result & assessment — Prarambh" },
      { property: "og:description", content: "AI-assisted assessment — human review required before any decision." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const state = useAppState();

  if (!state.assessment) {
    return (
      <CandidateShell title="Result" back="/home">
        <h1 className="text-xl font-bold text-foreground">No assessment yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your AI pre-interview has not been completed, so no assessment is available.
        </p>
        <div className="mt-4">
          <LinkButton to="/interview-status" size="lg" className="w-full">
            View interview status
          </LinkButton>
        </div>
      </CandidateShell>
    );
  }

  const { dimensions, overall } = state.assessment;
  const shortlisted = state.shortlisted === true;

  return (
    <CandidateShell title="Result & assessment" back="/home">
      <h1 className="text-xl font-bold text-foreground">Your result</h1>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <Card className="mt-4">
        <SectionTitle>Status</SectionTitle>
        <ul className="space-y-2 text-sm">
          {[
            ["Application status", "Active"],
            ["Interview status", "AI Pre-Interview Completed"],
            ["Assessment status", "Assessment completed"],
            ["Shortlisting status", shortlisted ? "Shortlisted for human interview" : "Not shortlisted for the next stage"],
            ["Next step", shortlisted ? "Await final interview call letter" : "Review your development feedback"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium text-foreground">{v}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-3">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>AI assessment</SectionTitle>
          <Pill tone={overall >= 75 ? "success" : "warning"}>Overall {overall}</Pill>
        </div>
        <div className="space-y-4">
          {dimensions.map((d) => (
            <ScoreBar key={d.dimension} label={d.dimension} score={d.score} evidence={d.evidence} />
          ))}
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        <Notice tone="info" title="AI-assisted assessment — Human review required">
          AI-generated scores are recommendations for authorised human reviewers. The final recruitment decision is
          always taken by the recruitment board.
        </Notice>
        {!shortlisted && (
          <Notice tone="warning" title="Your application was not shortlisted for the next stage">
            Constructive feedback based on your assessment evidence is available.
          </Notice>
        )}
        <LinkButton to="/feedback" size="lg" className="w-full">
          {shortlisted ? "View development feedback" : "How you can improve"}
        </LinkButton>
        <LinkButton to="/timeline" variant="outline" size="md" className="w-full">
          View application timeline
        </LinkButton>
      </div>
    </CandidateShell>
  );
}
