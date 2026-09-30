import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, DemoBadge, Notice } from "@/components/ui-kit";
import { setState, useAppState } from "@/lib/app-state";
import { DEMO_OTP } from "@/lib/demo-data";

export const Route = createFileRoute("/otp")({
  head: () => ({
    meta: [
      { title: "Verify OTP — Prarambh" },
      { name: "description", content: "Enter the 6-digit OTP to verify your mobile number." },
      { property: "og:title", content: "Verify OTP — Prarambh" },
      { property: "og:description", content: "Demo OTP verification for the Prarambh prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError("Incorrect OTP. In demo mode the OTP is 123456.");
      return;
    }
    setState({ loggedIn: true });
    navigate({ to: "/profile" });
  }

  return (
    <CandidateShell title="Verify your number" back="/login" hideNav>
      <h1 className="text-2xl font-bold text-foreground">Enter the 6-digit OTP</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sent to {state.mobile ? `+91 ${state.mobile}` : "your registered mobile number"}.
      </p>
      <div className="mt-3">
        <DemoBadge label={`Demo Mode — OTP is ${DEMO_OTP}`} />
      </div>

      <form onSubmit={verify} className="mt-6 space-y-4" noValidate>
        <label htmlFor="otp" className="block text-sm font-medium text-foreground">
          One-time password
        </label>
        <input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          aria-invalid={error ? true : undefined}
          className={`h-14 w-full rounded-lg border bg-card text-center text-2xl font-bold tracking-[0.5em] text-foreground ${
            error ? "border-destructive" : "border-input"
          }`}
          placeholder="••••••"
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Verify & continue
        </Button>
        <button type="button" className="w-full text-sm font-medium text-secondary hover:underline">
          Resend OTP
        </button>
      </form>

      <div className="mt-6">
        <Notice tone="info" title="Accessibility">
          You can also request the OTP as a voice call in the full system.
        </Notice>
      </div>
    </CandidateShell>
  );
}
