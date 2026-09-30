import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, DemoBadge, Field, Notice } from "@/components/ui-kit";
import { setState } from "@/lib/app-state";
import { CANDIDATE } from "@/lib/demo-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Candidate login — Prarambh" },
      { name: "description", content: "Sign in with your mobile number and application or roll number." },
      { property: "og:title", content: "Candidate login — Prarambh" },
      { property: "og:description", content: "Mobile OTP login for the Prarambh recruitment prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("9876543210");
  const [roll, setRoll] = useState(CANDIDATE.rollNumber);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mobile.replace(/\D/g, "").length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!roll.trim()) {
      setError("Enter your application or roll number.");
      return;
    }
    setError(null);
    setState({ mobile, rollNumber: roll });
    navigate({ to: "/otp" });
  }

  return (
    <CandidateShell title="Login" back="/language" hideNav>
      <h1 className="text-2xl font-bold text-foreground">Login to continue</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the mobile number and application number registered with your written examination.
      </p>
      <div className="mt-3">
        <DemoBadge label="Demo Mode — prefilled sample candidate" />
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <Field
          label="Mobile Number"
          inputMode="numeric"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          hint="An OTP will be sent to this number."
          {...(error && error.includes("mobile") ? { error } : {})}
        />
        <Field
          label="Application / Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          hint={`Example: ${CANDIDATE.applicationId}`}
          {...(error && error.includes("application") ? { error } : {})}
        />
        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>

      <div className="mt-5">
        <Notice tone="warning" title="Prototype authentication">
          This prototype does not connect to a real government database. OTP verification runs in demo mode.
        </Notice>
      </div>
    </CandidateShell>
  );
}
