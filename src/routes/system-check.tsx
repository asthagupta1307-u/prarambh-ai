import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, Card, LinkButton, Notice, Pill, SectionTitle } from "@/components/ui-kit";
import { languageLabel } from "@/lib/demo-data";
import { setState, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/system-check")({
  head: () => ({
    meta: [
      { title: "Prepare for your interview — Prarambh" },
      { name: "description", content: "Run the camera, microphone, speaker and connection checks before your AI interview." },
      { property: "og:title", content: "Prepare for your interview — Prarambh" },
      { property: "og:description", content: "Readiness checklist and device tests for the AI pre-interview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SystemCheck,
});

type CheckKey = "camera" | "microphone" | "speaker" | "internet";

function SystemCheck() {
  const navigate = useNavigate();
  const state = useAppState();
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<CheckKey, "idle" | "pass" | "fail">>({
    camera: "idle",
    microphone: "idle",
    speaker: "idle",
    internet: "idle",
  });

  const checklist = [
    "Stable internet connection",
    "Quiet environment",
    "Camera working",
    "Microphone working",
    `Selected language: ${languageLabel(state.language)}`,
    "Identity verification completed",
    "Browser / app permissions granted",
  ];

  async function runCheck() {
    setRunning(true);
    setResults({ camera: "idle", microphone: "idle", speaker: "idle", internet: "idle" });

    let camera: "pass" | "fail" = "fail";
    let microphone: "pass" | "fail" = "fail";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      camera = stream.getVideoTracks().length > 0 ? "pass" : "fail";
      microphone = stream.getAudioTracks().length > 0 ? "pass" : "fail";
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      camera = "fail";
      microphone = "fail";
    }
    setResults((r) => ({ ...r, camera, microphone }));

    await new Promise((res) => setTimeout(res, 500));
    const speaker: "pass" | "fail" = typeof window !== "undefined" && "speechSynthesis" in window ? "pass" : "fail";
    setResults((r) => ({ ...r, speaker }));

    await new Promise((res) => setTimeout(res, 400));
    const internet: "pass" | "fail" = typeof navigator !== "undefined" && navigator.onLine ? "pass" : "fail";
    setResults((r) => ({ ...r, internet }));

    setRunning(false);
    if (camera === "pass" && microphone === "pass" && internet === "pass") {
      setState({ systemCheckPassed: true });
    }
  }

  const ready = state.systemCheckPassed;

  return (
    <CandidateShell title="Pre-interview check" back="/home">
      <h1 className="text-xl font-bold text-foreground">Prepare for your interview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Video mode is compulsory. Camera and microphone access are required for this interview.
      </p>

      <Card className="mt-4">
        <SectionTitle>Checklist</SectionTitle>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground">
              <span aria-hidden className="mt-0.5 text-success">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-3">
        <SectionTitle>Device tests</SectionTitle>
        <ul className="space-y-2">
          {(
            [
              ["camera", "Camera Test"],
              ["microphone", "Microphone Test"],
              ["speaker", "Speaker Test"],
              ["internet", "Internet Test"],
            ] as [CheckKey, string][]
          ).map(([key, label]) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-foreground">{label}</span>
              {results[key] === "pass" ? (
                <Pill tone="success">✓ Passed</Pill>
              ) : results[key] === "fail" ? (
                <Pill tone="danger">✕ Failed</Pill>
              ) : (
                <Pill tone="neutral">{running ? "Checking…" : "Not run"}</Pill>
              )}
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full" onClick={runCheck} disabled={running}>
          {running ? "Running system check…" : "Run system check"}
        </Button>
      </Card>

      <div className="mt-4 space-y-3">
        {results.camera === "fail" && !running && (
          <Notice tone="danger" title="Camera or microphone unavailable">
            Allow camera and microphone permissions in your browser, then run the check again. The interview cannot
            start without video.
          </Notice>
        )}
        {ready && <Notice tone="success" title="Ready for interview">All required checks passed.</Notice>}
        <Button size="lg" className="w-full" disabled={!ready} onClick={() => navigate({ to: "/interview" })}>
          Start AI interview
        </Button>
        <LinkButton to="/interview-status" variant="outline" size="md" className="w-full">
          Back to interview status
        </LinkButton>
      </div>
    </CandidateShell>
  );
}
