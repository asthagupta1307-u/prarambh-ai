import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Pill, Progress } from "@/components/ui-kit";
import { useAppState } from "@/lib/app-state";
import { buildStages, progressPercent } from "@/lib/progress";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Application timeline — Prarambh" },
      { name: "description", content: "A transparent nine-stage view of your government recruitment application." },
      { property: "og:title", content: "Application timeline — Prarambh" },
      { property: "og:description", content: "Status, dates and next action for every recruitment stage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const state = useAppState();
  const stages = buildStages(state);

  return (
    <CandidateShell title="Application timeline" back="/home">
      <h1 className="text-xl font-bold text-foreground">Your recruitment journey</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every stage, with its status, date and next action.</p>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <Card className="mt-4">
        <Progress value={progressPercent(stages)} label="Overall progress" />
      </Card>

      <ol className="mt-5 space-y-0">
        {stages.map((stage, i) => (
          <li key={stage.key} className="relative flex gap-4 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  stage.status === "completed"
                    ? "bg-success text-success-foreground"
                    : stage.status === "current"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-muted text-muted-foreground"
                }`}
              >
                {stage.status === "completed" ? "✓" : i + 1}
              </span>
              {i < stages.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <Card className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">{stage.title}</h2>
                <Pill tone={stage.status === "completed" ? "success" : stage.status === "current" ? "info" : "neutral"}>
                  {stage.status === "completed" ? "Completed" : stage.status === "current" ? "Current stage" : "Pending"}
                </Pill>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{stage.date}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stage.detail}</p>
              {stage.status === "current" && stage.action && (
                <div className="mt-3">
                  <LinkButton
                    to={state.booking ? "/system-check" : stage.key === "interview" ? "/book" : "/home"}
                    size="sm"
                  >
                    {stage.action}
                  </LinkButton>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ol>
    </CandidateShell>
  );
}
