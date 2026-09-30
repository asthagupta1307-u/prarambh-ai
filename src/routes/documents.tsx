import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CandidateShell } from "@/components/candidate-shell";
import { Button, Card, DemoBadge, Notice, Pill, SectionTitle } from "@/components/ui-kit";
import { DOCUMENTS } from "@/lib/demo-data";
import { OCRService } from "@/lib/ai-service";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents & identity verification — Prarambh" },
      { name: "description", content: "Track document verification and OCR extraction for your application." },
      { property: "og:title", content: "Documents & identity verification — Prarambh" },
      { property: "og:description", content: "Prototype OCR-assisted document verification for government recruitment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const [ocr, setOcr] = useState<ReturnType<typeof OCRService.extract> | null>(null);

  return (
    <CandidateShell title="Documents" back="/home">
      <h1 className="text-xl font-bold text-foreground">Identity & document verification</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Documents are checked with OCR extraction and confirmed by an authorised officer.
      </p>
      <div className="mt-3">
        <DemoBadge label="Sample / Demo Recruitment Data" />
      </div>

      <ul className="mt-4 space-y-3">
        {DOCUMENTS.map((doc) => (
          <Card as="li" key={doc.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{doc.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {doc.method} · {doc.date}
                </p>
              </div>
              <Pill tone={doc.status === "Verified" ? "success" : "neutral"}>
                {doc.status === "Verified" ? "✓ Verified" : doc.status}
              </Pill>
            </div>
            {doc.status === "Verified" && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setOcr(OCRService.extract(doc.name))}>
                View OCR extraction
              </Button>
            )}
          </Card>
        ))}
      </ul>

      {ocr && (
        <Card className="mt-4">
          <SectionTitle>OCR extraction — {ocr.documentName}</SectionTitle>
          <p className="text-xs text-muted-foreground">Confidence {(ocr.confidence * 100).toFixed(0)}%</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            {ocr.fields.map((f) => (
              <div key={f.key} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{f.key}</dt>
                <dd className="font-medium text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">{ocr.note}</p>
        </Card>
      )}

      <div className="mt-4">
        <Notice tone="info" title="Identity verification at interview">
          Before the AI pre-interview starts you will confirm your application number and show a valid photo ID.
          Facial recognition is not used to identify candidates in this prototype.
        </Notice>
      </div>
    </CandidateShell>
  );
}
