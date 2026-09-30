import { createFileRoute, notFound } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Pill, SectionTitle } from "@/components/ui-kit";
import { ALL_LANGUAGES, RECRUITMENTS } from "@/lib/demo-data";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const recruitment = RECRUITMENTS.find((r) => r.id === params.id);
    if (!recruitment) throw notFound();
    return { recruitment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Recruitment not found — Prarambh" }, { name: "robots", content: "noindex" }] };
    }
    const { recruitment } = loaderData;
    const title = `${recruitment.post} — Prarambh`;
    const description = `${recruitment.department}. Applications close ${recruitment.closes}. Demo recruitment data.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RecruitmentDetail,
});

const SELECTION = [
  "Written Exam",
  "Eligibility Review",
  "AI Pre-Interview",
  "Human Interview Shortlist",
  "Final Human Interview",
  "Decision",
];

function RecruitmentDetail() {
  const { recruitment } = Route.useLoaderData();

  return (
    <CandidateShell title={recruitment.post} back="/opportunities">
      <h1 className="text-xl font-bold text-foreground">{recruitment.post}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{recruitment.department}</p>
      <p className="text-sm text-muted-foreground">{recruitment.organisation}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill tone="info">Match {recruitment.match}%</Pill>
        <Pill tone="neutral">{recruitment.type}</Pill>
        <Pill tone="warning">Closes {recruitment.closes}</Pill>
        <DemoBadge label="Demo Data" />
      </div>

      <div className="mt-5 space-y-4">
        <Card>
          <SectionTitle>Job description</SectionTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">{recruitment.description}</p>
        </Card>

        <Card>
          <SectionTitle>Eligibility & qualification</SectionTitle>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {recruitment.eligibility.map((e) => (
              <li key={e} className="flex gap-2">
                <span aria-hidden className="text-primary">
                  •
                </span>
                {e}
              </li>
            ))}
          </ul>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Qualification</dt>
              <dd className="font-medium text-foreground">{recruitment.qualification}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Experience</dt>
              <dd className="font-medium text-foreground">{recruitment.experience}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Written exam status</dt>
              <dd className="font-medium text-success">Qualified</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Vacancies</dt>
              <dd className="font-medium text-foreground">{recruitment.vacancies}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <SectionTitle>Interview process</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Standardised AI pre-interview in video mode, duration {recruitment.interviewDuration}. AI scores are
            recommendations for authorised human reviewers.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Available languages: </span>
            {recruitment.languages.map((c) => ALL_LANGUAGES.find((l) => l.code === c)?.label).join(", ")}
          </p>
        </Card>

        <Card>
          <SectionTitle>Selection stages</SectionTitle>
          <ol className="space-y-2">
            {SELECTION.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span aria-hidden className="grid size-6 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground">{stage}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <SectionTitle>Important dates</SectionTitle>
          <dl className="space-y-2">
            {recruitment.dates.map((d) => (
              <div key={d.label} className="flex justify-between gap-3 text-sm">
                <dt className="text-muted-foreground">{d.label}</dt>
                <dd className="font-medium text-foreground">{d.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <SectionTitle>Documents required</SectionTitle>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {recruitment.documents.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </Card>

        <LinkButton to="/book" size="lg" className="w-full">
          Book AI Interview
        </LinkButton>
      </div>
    </CandidateShell>
  );
}
