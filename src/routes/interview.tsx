import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Notice, Pill } from "@/components/ui-kit";
import { InterviewService, SpeechService, EvaluationService, VisionService, type IntegrityEvent } from "@/lib/ai-service";
import { languageLabel } from "@/lib/demo-data";
import { setState, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Prarambh AI Interview" },
      { name: "description", content: "Standardised AI pre-interview in video mode with live speech transcription." },
      { property: "og:title", content: "Prarambh AI Interview" },
      { property: "og:description", content: "Eight standardised questions, equal criteria for every candidate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InterviewRoom,
});

type Phase = "permission" | "asking" | "listening" | "processing" | "done";

function InterviewRoom() {
  const navigate = useNavigate();
  const state = useAppState();
  const questions = InterviewService.getQuestionSet(state.recruitmentId);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopListenRef = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<Phase>("permission");
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<{ question: string; category: string; answer: string }[]>([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [events, setEvents] = useState<IntegrityEvent[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const question = questions[index]!;
  const questionText = InterviewService.questionText(question, state.language);

  /* timer + integrity monitor */
  useEffect(() => {
    if (phase === "permission" || phase === "done") return;
    const t = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        const ev = VisionService.sampleEvent(next);
        if (ev) setEvents((list) => [...list, ev]);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPermissionError(null);
      setPhase("asking");
    } catch {
      setPermissionError("Camera and microphone access are required for this interview.");
    }
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      SpeechService.stopSpeaking();
      stopListenRef.current?.();
    };
  }, []);

  /* speak the question when it changes */
  useEffect(() => {
    if (phase !== "asking") return;
    SpeechService.speak(questionText, state.language);
  }, [phase, questionText, state.language]);

  function startAnswer() {
    SpeechService.stopSpeaking();
    setTranscript("");
    setPhase("listening");
    stopListenRef.current = SpeechService.listen(
      state.language,
      (partial) => setTranscript(partial),
      (final) => setTranscript(final),
    );
  }

  function submitAnswer() {
    stopListenRef.current?.();
    stopListenRef.current = null;
    setPhase("processing");
    const answer = transcript.trim() || "(No speech detected — marked for reviewer attention.)";
    const record = { question: questionText, category: question.category, answer };
    const next = [...answers, record];
    setAnswers(next);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
        setTranscript("");
        setPhase("asking");
      } else {
        finish(next);
      }
    }, 1200);
  }

  function finish(all: { question: string; category: string; answer: string }[]) {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    SpeechService.stopSpeaking();
    const assessment = EvaluationService.evaluate(all.map((a) => a.answer));
    setState({
      interviewCompleted: true,
      transcripts: all,
      assessment,
      shortlisted: assessment.overall >= 75,
      integrityLog: events,
    });
    setPhase("done");
    setTimeout(() => navigate({ to: "/result" }), 900);
  }

  function toggleCamera() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
      if (!track.enabled)
        setEvents((l) => [...l, { time: new Date().toTimeString().slice(0, 8), message: "Camera turned off by candidate.", level: "warning" }]);
    }
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (phase === "permission") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="card-surface w-full max-w-md p-6">
          <h1 className="text-xl font-bold text-foreground">Prarambh AI Interview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Video mode is compulsory for the AI pre-interview. Camera and microphone access are required for this
            interview.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>• 8 standardised questions</li>
            <li>• Language: {languageLabel(state.language)}</li>
            <li>• Approximately 12–15 minutes</li>
            <li>• Interview integrity monitoring is active</li>
          </ul>
          {permissionError && (
            <div className="mt-4">
              <Notice tone="danger" title="Permission required">
                {permissionError}
              </Notice>
            </div>
          )}
          <Button size="lg" className="mt-5 w-full" onClick={startCamera}>
            Allow camera & microphone and begin
          </Button>
          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => navigate({ to: "/home" })}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 py-0 md:py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background shadow-lift md:min-h-[840px] md:rounded-2xl md:border md:border-border">
        <header className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3 md:rounded-t-2xl">
          <div>
            <p className="text-sm font-semibold text-foreground">Prarambh AI Interview</p>
            <p className="text-[11px] text-muted-foreground">
              {phase === "done" ? "Interview completed" : "Interview in progress"}
            </p>
          </div>
          <Pill tone={events.some((e) => e.level === "warning") ? "warning" : "success"}>● Monitoring</Pill>
        </header>

        <div className="px-4 py-3">
          <div className="relative overflow-hidden rounded-xl border border-border bg-foreground/90">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label="Your camera preview"
              className="aspect-[4/3] w-full object-cover"
            />
            {!cameraOn && (
              <p className="absolute inset-0 grid place-items-center bg-foreground/80 text-sm font-medium text-background">
                Camera is off
              </p>
            )}
            <div className="absolute left-2 top-2 flex gap-1.5">
              <span className="rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                {mmss}
              </span>
              <span className="rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                Question {index + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <Button variant={cameraOn ? "outline" : "danger"} size="sm" onClick={toggleCamera}>
              {cameraOn ? "Camera on" : "Camera off"}
            </Button>
            <Button variant={micOn ? "outline" : "danger"} size="sm" onClick={toggleMic}>
              {micOn ? "Mic on" : "Mic off"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => SpeechService.speak(questionText, state.language)}>
              Repeat
            </Button>
            <Button variant="danger" size="sm" onClick={() => finish(answers)}>
              End
            </Button>
          </div>

          <section className="card-surface mt-3 p-4">
            <div className="flex items-start gap-3">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                AI
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {question.category}
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">{questionText}</p>
              </div>
            </div>
          </section>

          <section className="card-surface mt-3 min-h-28 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Live transcription
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground" aria-live="polite">
              {phase === "listening"
                ? transcript || "Listening… you can begin speaking."
                : phase === "processing"
                  ? "Processing… AI is preparing the next question."
                  : transcript || "You can begin speaking once you start your answer."}
            </p>
          </section>

          <div className="mt-3 space-y-2">
            {phase === "asking" && (
              <Button size="lg" className="w-full" onClick={startAnswer}>
                Start answering
              </Button>
            )}
            {phase === "listening" && (
              <Button size="lg" className="w-full" onClick={submitAnswer}>
                Submit answer & continue
              </Button>
            )}
            {phase === "processing" && (
              <Button size="lg" className="w-full" disabled>
                Processing…
              </Button>
            )}
            {phase === "done" && <Notice tone="success" title="Interview completed — preparing your assessment" />}
          </div>

          {events.length > 0 && (
            <section className="card-surface mt-3 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Integrity event log
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                {events.map((e, i) => (
                  <li key={`${e.time}-${i}`}>
                    <span className="font-medium text-foreground">{e.time}</span> — {e.message}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Alerts are flagged for human review only. No candidate is rejected automatically.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
