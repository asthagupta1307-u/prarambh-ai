import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Card, DemoBadge, Notice, Pill, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/fairness")({
  head: () => ({
    meta: [
      { title: "Fairness & evaluation controls — Prarambh Admin" },
      { name: "description", content: "Standardised questions, blind review, excluded attributes, human review and audit logging." },
      { property: "og:title", content: "Fairness & evaluation controls — Prarambh Admin" },
      { property: "og:description", content: "Bias-aware evaluation controls for AI-assisted government recruitment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Fairness,
});

const CONTROLS = [
  { key: "Standardised Questions", value: "ON", locked: false, note: "Identical question categories for every candidate on a post." },
  { key: "Blind Review", value: "ON", locked: false, note: "Identity details hidden during initial evaluation." },
  { key: "Protected Attributes Excluded", value: "ON", locked: true, note: "Gender, caste, religion, age and appearance are never scored." },
  { key: "Human Review", value: "REQUIRED", locked: true, note: "No decision is finalised by AI alone." },
  { key: "Audit Logging", value: "ON", locked: true, note: "Every evaluation action is recorded with reviewer and timestamp." },
];

const RULES = [
  "Use standardised questions and role-specific rubrics.",
  "Avoid sensitive personal attributes in scoring.",
  "Blind unnecessary identity information during initial review.",
  "Keep an auditable trail of every decision.",
  "Allow authorised reviewers to inspect the evidence behind each score.",
  "Flag potential inconsistencies for a second review.",
  "Do not infer personality, emotion, honesty, health or protected characteristics.",
  "Do not score appearance, and do not treat accent as a proxy for competence.",
];

function Fairness() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Standardised Questions": true,
    "Blind Review": true,
  });

  return (
    <AdminShell
      title="Fairness & evaluation controls"
      description="The bias-aware layer applied to every AI pre-interview assessment."
      actions={<DemoBadge label="Prototype Data" />}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>Active controls</SectionTitle>
          <ul className="space-y-3">
            {CONTROLS.map((c) => {
              const on = c.locked ? true : (toggles[c.key] ?? true);
              return (
                <li key={c.key} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.key}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>
                  </div>
                  {c.locked ? (
                    <Pill tone="success">{c.value} · locked</Pill>
                  ) : (
                    <label className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) => setToggles((t) => ({ ...t, [c.key]: e.target.checked }))}
                        className="size-4 accent-[var(--color-primary)]"
                      />
                      {on ? "ON" : "OFF"}
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Evaluation rules</SectionTitle>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {RULES.map((r) => (
              <li key={r} className="flex gap-2">
                <span aria-hidden className="text-primary">
                  •
                </span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>Computer vision scope</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Camera signals support interview integrity and technical quality only: face presence, framing,
            multiple-person presence and connection stability. Facial recognition is not used to identify candidates,
            and no personal or protected characteristic is inferred.
          </p>
        </Card>
        <Notice tone="warning" title="Consistency flag">
          2 assessments this week showed a score gap greater than 15 points between the AI recommendation and the
          reviewer decision. Both are queued for a second review.
        </Notice>
      </div>
    </AdminShell>
  );
}
