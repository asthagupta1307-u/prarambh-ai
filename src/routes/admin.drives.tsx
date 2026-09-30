import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button, Card, DemoBadge, Field, Notice, Pill, SectionTitle } from "@/components/ui-kit";
import { ALL_LANGUAGES, QUESTION_FRAMEWORK, RECRUITMENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/drives")({
  head: () => ({
    meta: [
      { title: "Recruitment drives — Prarambh Admin" },
      { name: "description", content: "Create recruitment drives and define eligibility, languages and interview criteria." },
      { property: "og:title", content: "Recruitment drives — Prarambh Admin" },
      { property: "og:description", content: "Configure standardised AI pre-interview criteria for each post." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Drives,
});

function Drives() {
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [post, setPost] = useState("");
  const [vacancies, setVacancies] = useState("");

  return (
    <AdminShell
      title="Recruitment drives"
      description="Define posts, eligibility, permitted languages and interview criteria."
      actions={
        <>
          <DemoBadge label="Prototype Data" />
          <Button size="sm" onClick={() => setCreating((c) => !c)}>
            {creating ? "Close" : "Create drive"}
          </Button>
        </>
      }
    >
      {creating && (
        <Card className="mb-6">
          <SectionTitle>New recruitment drive</SectionTitle>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setCreated(post || "Untitled post");
              setCreating(false);
              setPost("");
              setVacancies("");
            }}
          >
            <Field label="Post name" value={post} onChange={(e) => setPost(e.target.value)} placeholder="e.g. Assistant Innovation Officer" />
            <Field label="Vacancies" inputMode="numeric" value={vacancies} onChange={(e) => setVacancies(e.target.value)} placeholder="42" />
            <Field label="Department" placeholder="Department of Electronics & IT" />
            <Field label="Application closing date" placeholder="30 Sep 2026" />
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-foreground">Permitted interview languages</p>
              <div className="flex flex-wrap gap-2">
                {ALL_LANGUAGES.map((l) => (
                  <label key={l.code} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm">
                    <input type="checkbox" defaultChecked={["en", "hi"].includes(l.code)} className="size-4 accent-[var(--color-primary)]" />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save drive</Button>
            </div>
          </form>
        </Card>
      )}

      {created && (
        <div className="mb-6">
          <Notice tone="success" title={`Drive “${created}” saved (prototype)`}>
            Standardised question set v3 and the published rubric were attached automatically.
          </Notice>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {RECRUITMENTS.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">{r.post}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.department}</p>
              </div>
              <Pill tone="info">{r.vacancies} vacancies</Pill>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Qualification</dt>
                <dd className="font-medium text-foreground">{r.qualification}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="font-medium text-foreground">{r.experience}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Closes</dt>
                <dd className="font-medium text-foreground">{r.closes}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Languages</dt>
                <dd className="font-medium text-foreground">
                  {r.languages.map((c) => ALL_LANGUAGES.find((l) => l.code === c)?.label).join(", ")}
                </dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <SectionTitle>Standardised interview criteria (locked)</SectionTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Every candidate for a post receives the same question categories and the same scoring rubric.
        </p>
        <ol className="grid gap-2 md:grid-cols-2">
          {QUESTION_FRAMEWORK.map((q) => (
            <li key={q.index} className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Question {q.index} · {q.category}
              </p>
              <p className="mt-1 text-sm text-foreground">{q.text.en}</p>
            </li>
          ))}
        </ol>
      </Card>
    </AdminShell>
  );
}
