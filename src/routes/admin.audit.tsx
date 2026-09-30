import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { Card, DemoBadge, Notice, Pill } from "@/components/ui-kit";
import { AUDIT_TRAIL } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit trail — Prarambh Admin" },
      { name: "description", content: "An auditable record of assessments, integrity alerts and reviewer decisions." },
      { property: "og:title", content: "Audit trail — Prarambh Admin" },
      { property: "og:description", content: "Every evaluation action recorded with actor and timestamp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Audit,
});

function Audit() {
  return (
    <AdminShell
      title="Audit trail"
      description="Every assessment, alert and reviewer decision is recorded."
      actions={<DemoBadge label="Prototype Data" />}
    >
      <Card className="p-0">
        <ul>
          {AUDIT_TRAIL.map((entry) => (
            <li key={entry.time + entry.event} className="flex flex-wrap items-start gap-3 border-b border-border px-4 py-3 last:border-0">
              <span className="w-44 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{entry.time}</span>
              <Pill tone={entry.actor === "Integrity Monitor" ? "warning" : entry.actor === "AI Assessment" ? "info" : "neutral"}>
                {entry.actor}
              </Pill>
              <span className="min-w-0 flex-1 text-sm text-foreground">{entry.event}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-4">
        <Notice tone="info" title="Retention">
          In a production deployment, audit records would be retained per the recruitment authority's records policy
          and made available to authorised reviewers and auditors only.
        </Notice>
      </div>
    </AdminShell>
  );
}
