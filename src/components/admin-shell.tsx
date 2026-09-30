import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DemoBadge, WordMark } from "./ui-kit";

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/drives", label: "Recruitment drives" },
  { to: "/admin/candidates", label: "Candidates" },
  { to: "/admin/fairness", label: "Fairness & controls" },
  { to: "/admin/analytics", label: "Workforce analytics" },
  { to: "/admin/audit", label: "Audit trail" },
];

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-5 py-6 lg:flex">
          <WordMark subtitle="Recruitment Admin" />
          <nav aria-label="Dashboard" className="mt-6 flex-1 space-y-1">
            {NAV.map((item) => {
              const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "border-highlight bg-highlight-soft text-primary" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-border pt-4">
            <DemoBadge label="Prototype Data" />
            <Link to="/home" className="block text-xs font-medium text-secondary hover:underline">
              Open candidate app →
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-border bg-surface px-5 py-5 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-bold text-primary">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              <div className="flex items-center gap-2">{actions}</div>
            </div>
            <nav aria-label="Dashboard" className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                   className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
           <main className="px-5 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
