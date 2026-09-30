import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./ui-kit";

const NAV = [
  { to: "/home", label: "Home", icon: "M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" },
  { to: "/opportunities", label: "Roles", icon: "M4 7h16v13H4zM9 7V5a3 3 0 0 1 6 0v2" },
  { to: "/timeline", label: "Progress", icon: "M6 3v18M6 7h12M6 13h9" },
  { to: "/documents", label: "Documents", icon: "M7 3h7l5 5v13H7zM14 3v5h5" },
  { to: "/profile", label: "Profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0" },
];

export function CandidateShell({
  children,
  title,
  back,
  hideNav,
}: {
  children: ReactNode;
  title?: string;
  back?: string;
  hideNav?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background py-0 md:py-7">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-surface shadow-lift md:min-h-[840px] md:rounded-lg md:border md:border-border">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-primary bg-surface px-5 py-4 md:rounded-t-lg">
          {back ? (
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={back as any}
              aria-label="Go back"
              className="grid size-9 place-items-center rounded-md border border-border text-primary hover:bg-primary-soft"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <Logo size={32} />
          )}
          <div className="min-w-0 flex-1">
             <p className="truncate font-display text-sm font-semibold text-primary">{title ?? "Prarambh"}</p>
            <p className="truncate text-[11px] text-muted-foreground">Sample / Demo Recruitment Data</p>
          </div>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="grid size-9 place-items-center rounded-md border border-border text-primary hover:bg-primary-soft"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </header>

        <main className="flex-1 px-5 py-6 pb-28">{children}</main>

        {!hideNav && (
          <nav
            aria-label="Main"
            className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-border bg-surface px-2 py-2 md:rounded-b-lg"
          >
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 border-t-2 px-1 py-2 text-[11px] font-medium",
                    active ? "border-highlight bg-highlight-soft text-primary" : "border-transparent text-muted-foreground hover:bg-muted",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
