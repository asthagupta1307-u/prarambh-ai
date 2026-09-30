import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DemoBadge, LinkButton, Logo } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prarambh — AI-assisted government recruitment" },
      {
        name: "description",
        content:
          "Prarambh is a prototype AI pre-interview and citizen-centric government recruitment platform: fairer screening, faster recruitment, clearer opportunities.",
      },
      { property: "og:title", content: "Prarambh — AI-assisted government recruitment" },
      {
        property: "og:description",
        content: "Book an AI pre-interview, track your application, and see transparent assessment feedback.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background py-0 md:py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col bg-surface shadow-lift md:min-h-[840px] md:rounded-lg md:border md:border-border">
        {splash ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <Logo size={72} />
            <div>
              <p className="text-2xl font-bold tracking-wide text-foreground">PRARAMBH</p>
              <p className="mt-1 text-sm text-muted-foreground">Fairer Screening. Faster Recruitment.</p>
            </div>
             <div className="h-1 w-40 overflow-hidden bg-muted" role="status" aria-label="Loading">
               <div className="h-full w-1/2 bg-highlight" />
            </div>
          </div>
        ) : (
           <div className="flex flex-1 flex-col border-t-4 border-primary px-7 py-10">
            <Logo size={56} />
             <h1 className="mt-8 font-display text-3xl font-bold leading-tight text-primary">Welcome to Prarambh</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Your transparent AI-assisted recruitment journey starts here.
            </p>
            <p className="mt-2 text-sm font-medium text-primary">
              Fairer Screening. Faster Recruitment. Clearer Opportunities.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Standardised AI pre-interview after the written exam",
                "Book a slot near you — no travel, no waiting",
                "See every stage of your application clearly",
                "Constructive feedback if you are not shortlisted",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-foreground">
                   <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-success-soft text-[11px] font-bold text-success">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 pt-10">
              <DemoBadge label="Hackathon prototype — Demo Data" />
              <LinkButton to="/language" size="lg" className="w-full">
                Get Started
              </LinkButton>
              <LinkButton to="/login" variant="outline" size="lg" className="w-full">
                Already registered? Login
              </LinkButton>
              <LinkButton to="/admin" variant="ghost" size="sm" className="w-full">
                Government HR dashboard →
              </LinkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
