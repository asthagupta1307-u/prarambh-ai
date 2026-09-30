import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Card, DemoBadge, Pill } from "@/components/ui-kit";
import { HR_CANDIDATES, RECRUITMENTS, languageLabel } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/candidates/")({
  head: () => ({
    meta: [
      { title: "Candidates — Prarambh Admin" },
      { name: "description", content: "Review AI assessment outputs in blind review mode and shortlist candidates." },
      { property: "og:title", content: "Candidates — Prarambh Admin" },
      { property: "og:description", content: "Blind review hides identity details during initial evaluation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Candidates,
});

function Candidates() {
  const [blind, setBlind] = useState(true);
  const [drive, setDrive] = useState("all");

  const rows = HR_CANDIDATES.filter((c) => drive === "all" || c.recruitmentId === drive);

  return (
    <AdminShell
      title="Candidates"
      description="AI assessment outputs are recommendations. Human review is required before any decision."
      actions={
        <>
          <DemoBadge label="Prototype Data" />
          <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium">
            <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
            Blind Review Mode
          </label>
        </>
      }
    >
      {blind && (
        <div className="mb-4 rounded-lg border border-secondary/30 bg-secondary-soft px-3 py-2 text-sm text-secondary">
          Blind Review Mode is ON — name, photo, gender, address, category and other personal identifiers are hidden.
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <label htmlFor="drive" className="sr-only">
          Filter by recruitment drive
        </label>
        <select
          id="drive"
          value={drive}
          onChange={(e) => setDrive(e.target.value)}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
        >
          <option value="all">All recruitment drives</option>
          {RECRUITMENTS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.post}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-sm">
          <caption className="sr-only">Candidate assessment list</caption>
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">Candidate</th>
              <th scope="col" className="px-4 py-3 font-medium">Post</th>
              <th scope="col" className="px-4 py-3 font-medium">Language</th>
              <th scope="col" className="px-4 py-3 font-medium">Interview</th>
              <th scope="col" className="px-4 py-3 font-medium">Overall</th>
              <th scope="col" className="px-4 py-3 font-medium">Integrity</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const r = RECRUITMENTS.find((x) => x.id === c.recruitmentId);
              return (
                <tr key={c.blindId} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link to="/admin/candidates/$id" params={{ id: c.blindId }} className="font-medium text-foreground hover:underline">
                      {blind ? c.blindId : c.name}
                    </Link>
                    {!blind && <span className="block text-xs text-muted-foreground">{c.blindId}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r?.post}</td>
                  <td className="px-4 py-3 text-muted-foreground">{languageLabel(c.language)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.interview}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-foreground">{c.overall ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Pill tone={c.integrity === "Clear" ? "success" : "warning"}>{c.integrity}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={c.status === "Shortlisted" ? "success" : c.status === "Not shortlisted" ? "danger" : "neutral"}>
                      {c.status}
                    </Pill>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
