import { createFileRoute } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Card, DemoBadge, Pill } from "@/components/ui-kit";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Prarambh" },
      { name: "description", content: "Recruitment updates, interview reminders and result announcements." },
      { property: "og:title", content: "Notifications — Prarambh" },
      { property: "og:description", content: "Stay informed about each stage of your government recruitment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const state = useAppState();

  const items = [
    state.booking && {
      tone: "success" as const,
      tag: "Interview",
      title: "Interview slot confirmed",
      body: `${state.booking.date} at ${state.booking.time}. Video mode is compulsory.`,
      time: "Just now",
    },
    state.assessment && {
      tone: "info" as const,
      tag: "Assessment",
      title: "AI assessment completed",
      body: "AI-assisted assessment — human review required.",
      time: "Today",
    },
    {
      tone: "warning" as const,
      tag: "Deadline",
      title: "Complete your AI interview by 30 September",
      body: "Slots close once the interview window ends.",
      time: "2 days ago",
    },
    {
      tone: "success" as const,
      tag: "Documents",
      title: "Document verification completed",
      body: "4 of 4 documents verified for MP-REC-2026-001284.",
      time: "18 Sep 2026",
    },
    {
      tone: "info" as const,
      tag: "Result",
      title: "Written examination result published",
      body: "You have qualified with 78.4%.",
      time: "12 Sep 2026",
    },
  ].filter(Boolean) as { tone: "success" | "info" | "warning"; tag: string; title: string; body: string; time: string }[];

  return (
    <CandidateShell title="Notifications" back="/home">
      <h1 className="text-xl font-bold text-foreground">Notifications</h1>
      <div className="mt-3">
        <DemoBadge label="Demo Data" />
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((n) => (
          <Card as="li" key={n.title}>
            <div className="flex items-start justify-between gap-3">
              <Pill tone={n.tone}>{n.tag}</Pill>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
            <h2 className="mt-2 text-sm font-semibold text-foreground">{n.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
          </Card>
        ))}
      </ul>
    </CandidateShell>
  );
}
