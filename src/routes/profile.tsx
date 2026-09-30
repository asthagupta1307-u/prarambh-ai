import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, LinkButton, Pill, SectionTitle } from "@/components/ui-kit";
import { CANDIDATE, RECRUITMENTS, languageLabel } from "@/lib/demo-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Candidate profile — Prarambh" },
      { name: "description", content: "Your verified recruitment profile, written exam result and eligibility status." },
      { property: "og:title", content: "Candidate profile — Prarambh" },
      { property: "og:description", content: "Application number, roll number, exam score and eligibility in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {tone ? <Pill tone={tone}>{value}</Pill> : value}
      </dd>
    </div>
  );
}

function ProfilePage() {
  const state = useAppState();
  const recruitment = RECRUITMENTS.find((r) => r.id === state.recruitmentId) ?? RECRUITMENTS[0]!;

  return (
    <CandidateShell title="My profile">
      <div className="flex items-center gap-3">
        <div className="grid size-14 place-items-center rounded-xl bg-primary-soft text-xl font-bold text-primary">
          {CANDIDATE.firstName.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{CANDIDATE.name}</h1>
          <p className="text-sm text-muted-foreground">{CANDIDATE.location}</p>
        </div>
      </div>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <div className="mt-5 space-y-4">
        <Card>
          <SectionTitle>Personal details</SectionTitle>
          <dl>
            <Row label="Name" value={CANDIDATE.name} />
            <Row label="Application Number" value={CANDIDATE.applicationId} />
            <Row label="Roll Number" value={CANDIDATE.rollNumber} />
            <Row label="Email" value={CANDIDATE.email} />
            <Row label="Mobile" value={CANDIDATE.mobile} />
            <Row label="Date of Birth" value={CANDIDATE.dob} />
            <Row label="Category" value={CANDIDATE.category} />
          </dl>
        </Card>

        <Card>
          <SectionTitle>Recruitment</SectionTitle>
          <dl>
            <Row label="Recruitment" value={recruitment.organisation} />
            <Row label="Post Applied" value={recruitment.post} />
            <Row label="Department" value={recruitment.department} />
            <Row label="Interview language" value={languageLabel(state.language)} />
          </dl>
        </Card>

        <Card>
          <SectionTitle>Examination & eligibility</SectionTitle>
          <dl>
            <Row label="Written Exam Score" value={CANDIDATE.writtenScore} />
            <Row label="Written Exam Status" value={CANDIDATE.writtenStatus} tone="success" />
            <Row label="Eligibility Status" value={CANDIDATE.eligibilityStatus} tone="success" />
            <Row
              label="Interview"
              value={state.interviewCompleted ? "AI Pre-Interview Completed" : "AI Pre-Interview Pending"}
              tone={state.interviewCompleted ? "success" : "warning"}
            />
          </dl>
        </Card>

        <LinkButton to="/home" size="lg" className="w-full">
          Go to dashboard
        </LinkButton>
        <LinkButton to="/language" variant="outline" size="md" className="w-full">
          Change interview language
        </LinkButton>
      </div>
    </CandidateShell>
  );
}
