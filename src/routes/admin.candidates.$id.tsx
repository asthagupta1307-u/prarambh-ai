import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button, Card, Notice, Pill, ScoreBar, SectionTitle } from "@/components/ui-kit";
import { AUDIT_TRAIL, HR_CANDIDATES, QUESTION_FRAMEWORK, RECRUITMENTS, languageLabel } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/candidates/$id")({
  loader: ({ params }) => {
    const candidate = HR_CANDIDATES.find((c) => c.blindId === params.id);
    if (!candidate) throw notFound();
    return { candidate };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Candidate not found — Prarambh Admin" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.candidate.blindId} assessment — Prarambh Admin`;
    return {
      meta: [
        { title },
        { name: "description", content: "Blind AI assessment record with evidence, integrity events and reviewer actions." },
        { property: "og:title", content: title },
        { property: "og:description", content: "AI-assisted assessment — human review required." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CandidateDetail,
});

const EVIDENCE: Record<string, string> = {
  "Role Knowledge": "Candidate correctly identified the key process steps.",
  "Problem Solving": "Candidate proposed a diagnostic sequence with limited preventive detail.",
  Communication: "Candidate gave a structured answer and explained the situation clearly.",
  "Situational Judgement": "Candidate balanced urgency with accuracy and escalated appropriately.",
  "Public Service Orientation": "Candidate consistently referred to citizen access and inclusion.",
  "Structured Thinking": "Answers followed a situation–action–result pattern in most responses.",
  "Role-specific Competencies": "Candidate described relevant delivery experience with examples.",
};

function CandidateDetail() {
  const { candidate } = Route.useLoaderData();
  const [blind, setBlind] = useState(true);
  const [decision, setDecision] = useState<string | null>(null);
  const recruitment = RECRUITMENTS.find((r) => r.id === candidate.recruitmentId);
  const scores = Object.entries(candidate.scores);

  return (
    <AdminShell
      title={blind ? candidate.blindId : candidate.name}
      description={`${recruitment?.post ?? ""} · ${languageLabel(candidate.language)}`}
      actions={
        <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium">
          <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
          Blind Review Mode
        </label>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>AI assessment (evidence-based)</SectionTitle>
              <Pill tone={(candidate.overall ?? 0) >= 75 ? "success" : "warning"}>
                Overall {candidate.overall ?? "—"}
              </Pill>
            </div>
            {scores.length === 0 ? (
              <p className="text-sm text-muted-foreground">Interview not completed yet — no assessment available.</p>
            ) : (
              <div className="space-y-4">
                {scores.map(([dim, score]) => (
                  <ScoreBar key={dim} label={dim} score={score} evidence={EVIDENCE[dim]} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle>Standardised question set</SectionTitle>
            <ol className="space-y-2 text-sm">
              {QUESTION_FRAMEWORK.map((q) => (
                <li key={q.index} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Q{q.index} · {q.category}
                  </p>
                  <p className="mt-1 text-foreground">{q.text.en}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <SectionTitle>Interview integrity events</SectionTitle>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {AUDIT_TRAIL.filter((a) => a.event.includes(candidate.blindId)).map((a) => (
                <li key={a.time + a.event}>
                  <span className="font-medium text-foreground">{a.time}</span> — {a.event}
                </li>
              ))}
              {AUDIT_TRAIL.every((a) => !a.event.includes(candidate.blindId)) && (
                <li>No integrity alerts recorded for this interview.</li>
              )}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Alerts never reject a candidate automatically — they are marked “Review required”.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionTitle>Record</SectionTitle>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Candidate ID</dt>
                <dd className="font-medium text-foreground">{candidate.blindId}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{blind ? "Hidden in blind review" : candidate.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Post</dt>
                <dd className="font-medium text-foreground">{recruitment?.post}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Interview</dt>
                <dd className="font-medium text-foreground">{candidate.interview}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Integrity</dt>
                <dd>
                  <Pill tone={candidate.integrity === "Clear" ? "success" : "warning"}>{candidate.integrity}</Pill>
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <SectionTitle>Reviewer decision</SectionTitle>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => setDecision("Shortlisted for final human interview")}>
                Shortlist for human interview
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setDecision("Marked for second review")}>
                Mark for second review
              </Button>
              <Button variant="danger" className="w-full" onClick={() => setDecision("Not shortlisted — feedback released")}>
                Do not shortlist
              </Button>
            </div>
            {decision && (
              <div className="mt-3">
                <Notice tone="success" title="Decision recorded (prototype)">
                  {decision}. Written to the audit trail with reviewer ID and timestamp.
                </Notice>
              </div>
            )}
          </Card>

          <Notice tone="info" title="AI-assisted assessment — Human review required">
            AI scores are recommendations only. The final decision rests with the authorised recruitment board.
          </Notice>
        </div>
      </div>
    </AdminShell>
  );
}
