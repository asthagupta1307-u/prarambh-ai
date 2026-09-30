import { createFileRoute, Link } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Notice, Pill, Progress, SectionTitle } from "@/components/ui-kit";
import { CANDIDATE, RECRUITMENTS, languageLabel } from "@/lib/demo-data";
import { useAppState } from "@/lib/app-state";
import { buildStages, progressPercent } from "@/lib/progress";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your recruitment dashboard — Prarambh" },
      { name: "description", content: "See your next step, application progress and upcoming deadlines." },
      { property: "og:title", content: "Your recruitment dashboard — Prarambh" },
      { property: "og:description", content: "Track your AI pre-interview, documents, feedback and opportunities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const TILES = [
  { to: "/interview-status", label: "Interview Status", hint: "Slot & readiness" },
  { to: "/documents", label: "Documents", hint: "Verification" },
  { to: "/timeline", label: "Application Timeline", hint: "9 stages" },
  { to: "/feedback", label: "Feedback", hint: "Skill development" },
  { to: "/exams", label: "Upcoming Exams", hint: "New notifications" },
  { to: "/opportunities", label: "Find Opportunities", hint: "Matched roles" },
];

function HomePage() {
  const state = useAppState();
  const stages = buildStages(state);
  const percent = progressPercent(stages);
  const recruitment = RECRUITMENTS.find((r) => r.id === state.recruitmentId) ?? RECRUITMENTS[0]!;

  const nextStatus = state.interviewCompleted
    ? state.assessment
      ? "Assessment completed — human review"
      : "AI Pre-Interview Completed"
    : state.booking
      ? "AI Pre-Interview Scheduled"
      : "AI Pre-Interview Pending";

  return (
    <CandidateShell title="Dashboard">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-primary">Good morning, {CANDIDATE.firstName}</h1>
          <p className="text-sm text-muted-foreground">
            {recruitment.post} · {languageLabel(state.language)}
          </p>
        </div>
        <Link to="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-md border border-primary/20 bg-primary-soft text-sm font-bold text-primary">
          {CANDIDATE.firstName.charAt(0)}
        </Link>
      </div>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <Card className="mt-5 border-l-4 border-l-highlight bg-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-highlight-foreground">Your next step is clear</p>
        <p className="mt-1 text-lg font-bold text-foreground">{nextStatus}</p>
        <div className="mt-3">
          <Progress value={percent} label="Application progress" />
        </div>
        <div className="mt-4">
          {state.interviewCompleted ? (
            <LinkButton to="/result" className="w-full">
              View result & assessment
            </LinkButton>
          ) : state.booking ? (
            <LinkButton to="/system-check" className="w-full">
              Start pre-interview check
            </LinkButton>
          ) : (
            <LinkButton to="/book" className="w-full">
              Book Interview Slot
            </LinkButton>
          )}
        </div>
      </Card>

      <div className="mt-4">
        <Notice tone="warning" title="Upcoming deadline">
          Complete your AI interview by 30 october 2026.
        </Notice>
      </div>

      <section className="mt-6">
        <SectionTitle action={<Link to="/timeline" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          Application progress
        </SectionTitle>
        <Card className="space-y-0 p-0">
          <ul>
            {stages.slice(2, 7).map((stage, i, arr) => (
              <li key={stage.key} className={`flex items-start gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <span
                  aria-hidden
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    stage.status === "completed"
                      ? "bg-success text-success-foreground"
                      : stage.status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {stage.status === "completed" ? "✓" : stage.status === "current" ? "●" : "○"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{stage.title}</span>
                  <span className="block text-xs text-muted-foreground">{stage.date}</span>
                </span>
                <Pill tone={stage.status === "completed" ? "success" : stage.status === "current" ? "info" : "neutral"}>
                  {stage.status === "completed" ? "Completed" : stage.status === "current" ? "Upcoming" : "Pending"}
                </Pill>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Quick access</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile) => (
            <Link
              key={tile.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={tile.to as any}
              className="card-surface border-l-2 border-l-transparent p-4 transition-colors hover:border-l-highlight hover:bg-muted"
            >
              <span className="block text-sm font-semibold text-foreground">{tile.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{tile.hint}</span>
            </Link>
          ))}
        </div>
      </section>
    </CandidateShell>
  );
}
