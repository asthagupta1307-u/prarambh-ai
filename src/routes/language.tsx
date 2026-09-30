import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, Notice, Pill } from "@/components/ui-kit";
import { ALL_LANGUAGES, RECRUITMENTS, CANDIDATE, type LanguageCode } from "@/lib/demo-data";
import { setState, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "Choose your interview language — Prarambh" },
      { name: "description", content: "Select an interview language permitted by the recruitment notification." },
      { property: "og:title", content: "Choose your interview language — Prarambh" },
      { property: "og:description", content: "Languages available depend on the recruitment configuration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LanguagePage,
});

function LanguagePage() {
  const state = useAppState();
  const navigate = useNavigate();
  const recruitment = RECRUITMENTS.find((r) => r.id === CANDIDATE.recruitmentId)!;
  const permitted = recruitment.languages;

  return (
    <CandidateShell title="Choose your language" back="/" hideNav>
      <h1 className="text-2xl font-bold text-foreground">Choose your language</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Select your preferred interview language. The list is set by the recruitment notification for{" "}
        <span className="font-medium text-foreground">{recruitment.post}</span>.
      </p>

      <ul className="mt-5 space-y-2">
        {ALL_LANGUAGES.map((lang) => {
          const allowed = permitted.includes(lang.code);
          const selected = state.language === lang.code;
          return (
            <li key={lang.code}>
              <button
                type="button"
                disabled={!allowed}
                onClick={() => setState({ language: lang.code as LanguageCode })}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted"
                } ${allowed ? "" : "cursor-not-allowed opacity-45"}`}
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground">{lang.label}</span>
                  <span className="block text-xs text-muted-foreground">{lang.native}</span>
                </span>
                {selected ? (
                  <Pill tone="success">Selected ✓</Pill>
                ) : allowed ? (
                  <span className="text-xs font-medium text-muted-foreground">Available</span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">Not permitted</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 space-y-3">
        <Notice tone="info" title="Why some languages are disabled">
          Only languages permitted by this recruitment notification can be used for the AI pre-interview.
        </Notice>
        <Button size="lg" className="w-full" onClick={() => navigate({ to: "/login" })}>
          Continue
        </Button>
      </div>
    </CandidateShell>
  );
}
