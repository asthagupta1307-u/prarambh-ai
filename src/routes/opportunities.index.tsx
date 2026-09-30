import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, Pill } from "@/components/ui-kit";
import { ALL_LANGUAGES, RECRUITMENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { title: "Find opportunities — Prarambh" },
      { name: "description", content: "Search and filter government roles matched to your profile." },
      { property: "og:title", content: "Find opportunities — Prarambh" },
      { property: "og:description", content: "Demo government recruitment listings with match scores and deadlines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Opportunities,
});

const FILTERS = ["Department", "State", "Qualification", "Recruitment type", "Deadline", "Language", "Location"];

function Opportunities() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const results = RECRUITMENTS.filter((r) =>
    `${r.post} ${r.department} ${r.organisation} ${r.location}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <CandidateShell title="Find opportunities">
      <h1 className="text-xl font-bold text-foreground">Find opportunities</h1>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <div className="mt-4">
        <label htmlFor="search" className="sr-only">
          Search government roles
        </label>
        <input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search government roles"
          className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={active === f}
            onClick={() => setActive(active === f ? null : f)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium ${
              active === f ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {active && (
        <p className="mt-2 text-xs text-muted-foreground">
          Filter “{active}” selected — filtering is illustrative in this prototype.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {results.map((r) => (
          <Card as="li" key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-foreground">{r.post}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.department}</p>
                <p className="text-xs text-muted-foreground">{r.organisation}</p>
              </div>
              <Pill tone="info">Match {r.match}%</Pill>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{r.location}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Closes</dt>
                <dd className="font-medium text-foreground">{r.closes}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Vacancies</dt>
                <dd className="font-medium text-foreground">{r.vacancies}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Languages</dt>
                <dd className="font-medium text-foreground">
                  {r.languages.map((c) => ALL_LANGUAGES.find((l) => l.code === c)?.label).join(", ")}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex gap-2">
              <Link
                to="/opportunities/$id"
                params={{ id: r.id }}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-input bg-card text-sm font-semibold text-foreground hover:bg-muted"
              >
                View details
              </Link>
              <Link
                to="/opportunities/$id"
                params={{ id: r.id }}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Apply
              </Link>
            </div>
          </Card>
        ))}
        {results.length === 0 && (
          <Card as="li">
            <p className="text-sm text-muted-foreground">No roles match “{query}”. Try a different search term.</p>
          </Card>
        )}
      </ul>
    </CandidateShell>
  );
}
