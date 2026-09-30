import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { Card, DemoBadge, Progress, SectionTitle } from "@/components/ui-kit";
import { ANALYTICS } from "@/lib/demo-data";
import { AnalyticsService } from "@/lib/ai-service";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Workforce analytics — Prarambh Admin" },
      { name: "description", content: "Recruitment throughput, department fill rates and predictive projections." },
      { property: "og:title", content: "Workforce analytics — Prarambh Admin" },
      { property: "og:description", content: "Predictive analytics for government recruitment planning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const forecast = AnalyticsService.predict(660, ANALYTICS.totals.qualified - ANALYTICS.totals.interviewed);

  return (
    <AdminShell
      title="Workforce analytics"
      description="Recruitment throughput and predictive planning across departments."
      actions={<DemoBadge label="Prototype Data" />}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle>Interviews completed per day</SectionTitle>
          <div className="flex h-44 items-end gap-3" role="img" aria-label="Interviews completed per day over the last seven days">
            {ANALYTICS.weekly.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground">{v}</span>
                <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${(v / 900) * 100}%` }} />
                <span className="text-[11px] text-muted-foreground">D{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Predictive analytics</SectionTitle>
          <ul className="space-y-3">
            {ANALYTICS.predictions.map((p) => (
              <li key={p.label} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="text-lg font-bold text-foreground">{p.value}</p>
                <p className="text-[11px] text-muted-foreground">{p.note}</p>
              </li>
            ))}
            <li>
              <p className="text-xs text-muted-foreground">Remaining pre-interviews clear in</p>
              <p className="text-lg font-bold text-foreground">{forecast.days} days</p>
              <p className="text-[11px] text-muted-foreground">{forecast.note}</p>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <SectionTitle>Department-wise recruitment</SectionTitle>
        <div className="space-y-4">
          {ANALYTICS.departments.map((d) => (
            <div key={d.name}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="text-xs text-muted-foreground">
                  {d.drives} drives · {d.candidates.toLocaleString("en-IN")} candidates
                </span>
              </div>
              <div className="mt-1.5">
                <Progress value={d.fill} label="Vacancy pipeline filled" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
