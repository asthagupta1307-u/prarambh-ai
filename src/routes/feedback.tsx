import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Notice, Pill, SectionTitle } from "@/components/ui-kit";
import { FeedbackService } from "@/lib/ai-service";
import { LEARNING } from "@/lib/demo-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Skill development feedback — Prarambh" },
      { name: "description", content: "Constructive, evidence-based feedback and recommended learning after your interview." },
      { property: "og:title", content: "Skill development feedback — Prarambh" },
      { property: "og:description", content: "Not shortlisted is not the end — see how to improve for the next opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const state = useAppState();

  if (!state.assessment) {
    return (
      <CandidateShell title="Feedback" back="/home">
        <h1 className="text-xl font-bold text-foreground">Feedback not available yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Feedback is generated from your AI pre-interview assessment evidence once the interview is completed.
        </p>
        <div className="mt-4">
          <LinkButton to="/interview-status" size="lg" className="w-full">
            View interview status
          </LinkButton>
        </div>
      </CandidateShell>
    );
  }

  const items = FeedbackService.build(state.assessment.dimensions);
  const shortlisted = state.shortlisted === true;

  return (
    <CandidateShell title="Feedback" back="/result">
      <h1 className="text-xl font-bold text-foreground">
        {shortlisted ? "Your development feedback" : "Your application was not shortlisted for the next stage"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This feedback is based on the evidence recorded during your standardised AI pre-interview.
      </p>
      <div className="mt-3">
        <DemoBadge label="Demo Data" />
      </div>

      <Card className="mt-4">
        <SectionTitle>How you can improve</SectionTitle>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.dimension}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">{item.dimension}</h2>
                <Pill tone={item.score >= 75 ? "success" : "warning"}>{item.score} / 100</Pill>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.suggestion}</p>
              <p className="mt-1 text-xs text-muted-foreground">Evidence: {item.evidence}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-3">
        <SectionTitle>Recommended learning</SectionTitle>
        <ol className="space-y-2 text-sm">
          {LEARNING.map((course, i) => (
            <li key={course} className="flex items-center gap-3">
              <span aria-hidden className="grid size-6 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-foreground">{course}</span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-4 space-y-3">
        <LinkButton to="/exams" size="lg" className="w-full">
          View recommended learning
        </LinkButton>
        <LinkButton to="/opportunities" variant="outline" size="lg" className="w-full">
          Explore upcoming opportunities
        </LinkButton>
        <Notice tone="info" title="Feedback is evidence-based">
          Suggestions come from your recorded responses against the published rubric. You may request a human review
          of your assessment.
        </Notice>
      </div>
    </CandidateShell>
  );
}
