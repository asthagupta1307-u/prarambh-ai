import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { Card, DemoBadge, Pill, Progress, SectionTitle } from "@/components/ui-kit";
import { ANALYTICS, HR_CANDIDATES, RECRUITMENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Recruitment overview — Prarambh Admin" },
      { name: "description", content: "Government HR dashboard: drives, interview progress and shortlisting at a glance." },
      { property: "og:title", content: "Recruitment overview — Prarambh Admin" },
      { property: "og:description", content: "Monitor AI pre-interviews and shortlisting across recruitment drives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminOverview,
});

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </Card>
  );
}

function AdminOverview() {
  const { totals } = ANALYTICS;
  const interviewedPct = Math.round((totals.interviewed / totals.qualified) * 100);

  return (
    <AdminShell
      title="Recruitment overview"
      description="Madhya Pradesh Public Service Recruitment — Demo 2026"
      actions={<DemoBadge label="Prototype Data" />}
    >
      <div className="grid gap-0 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Applicants" value={totals.applicants.toLocaleString("en-IN")} note="Across 4 active drives" />
        <Stat label="Written qualified" value={totals.qualified.toLocaleString("en-IN")} note="Eligible for pre-interview" />
        <Stat label="AI pre-interviews done" value={totals.interviewed.toLocaleString("en-IN")} note={`${interviewedPct}% of qualified`} />
        <Stat label="Shortlisted" value={totals.shortlisted.toLocaleString("en-IN")} note="Pending final interview" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-t-4 border-t-primary lg:col-span-2">
          <SectionTitle
            action={
              <Link to="/admin/candidates" className="text-xs font-semibold text-secondary hover:underline">
                View all candidates
              </Link>
            }
          >
            Recent AI assessments (blind review)
          </SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Recent AI assessments in blind review mode</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-3 font-medium">Candidate ID</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Interview</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Overall</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Integrity</th>
                  <th scope="col" className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {HR_CANDIDATES.slice(0, 5).map((c) => (
                  <tr key={c.blindId} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-foreground">
                      <Link to="/admin/candidates/$id" params={{ id: c.blindId }} className="hover:underline">
                        {c.blindId}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{c.interview}</td>
                    <td className="py-2.5 pr-3 font-semibold tabular-nums text-foreground">{c.overall ?? "—"}</td>
                    <td className="py-2.5 pr-3">
                      <Pill tone={c.integrity === "Clear" ? "success" : "warning"}>{c.integrity}</Pill>
                    </td>
                    <td className="py-2.5">
                      <Pill tone={c.status === "Shortlisted" ? "success" : c.status === "Not shortlisted" ? "danger" : "neutral"}>
                        {c.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

         <Card className="border-t-4 border-t-highlight">
          <SectionTitle>Interview throughput</SectionTitle>
          <div className="flex h-36 items-end gap-2" role="img" aria-label="Interviews completed over the last seven days">
            {ANALYTICS.weekly.map((v, i) => (
              <div key={i} className="flex h-full flex-1 items-end">
                <div className="rounded-t-md bg-primary/80" style={{ height: `${(v / 900) * 100}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Interviews completed per day, last 7 days.</p>
          <div className="mt-4 space-y-3">
            <Progress value={interviewedPct} label="Pre-interview stage completion" />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {RECRUITMENTS.map((r) => (
          <Card key={r.id}>
            <h2 className="text-sm font-semibold text-foreground">{r.post}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{r.department}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Vacancies</dt>
                <dd className="font-medium text-foreground">{r.vacancies}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Closes</dt>
                <dd className="font-medium text-foreground">{r.closes}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <Link to="/admin/drives" className="text-xs font-semibold text-secondary hover:underline">
                Manage drive →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
