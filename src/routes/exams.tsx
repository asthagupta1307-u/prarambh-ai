import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Pill } from "@/components/ui-kit";
import { UPCOMING_EXAMS } from "@/lib/demo-data";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "Upcoming government exams — Prarambh" },
      { name: "description", content: "Discover relevant upcoming government examinations and application windows." },
      { property: "og:title", content: "Upcoming government exams — Prarambh" },
      { property: "og:description", content: "Demo listings of upcoming public service examinations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExamsPage,
});

function ExamsPage() {
  return (
    <CandidateShell title="Upcoming exams" back="/home">
      <h1 className="text-xl font-bold text-foreground">Upcoming examinations</h1>
      <p className="mt-1 text-sm text-muted-foreground">Matched to your qualification and preferred state.</p>
      <div className="mt-3">
        <DemoBadge label="Demo Data" />
      </div>

      <ul className="mt-4 space-y-3">
        {UPCOMING_EXAMS.map((exam) => (
          <Card as="li" key={exam.name}>
            <h2 className="text-sm font-semibold text-foreground">{exam.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{exam.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="info">Exam {exam.date}</Pill>
              <Pill tone="neutral">{exam.apply}</Pill>
            </div>
          </Card>
        ))}
      </ul>

      <div className="mt-4">
        <LinkButton to="/opportunities" variant="outline" size="lg" className="w-full">
          Explore current opportunities
        </LinkButton>
      </div>
    </CandidateShell>
  );
}
