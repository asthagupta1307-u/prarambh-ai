import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------- Branding --------------------------------- */

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Prarambh logo"
      className="shrink-0"
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="var(--color-primary-soft)" stroke="var(--color-primary)" strokeWidth="1.5" />
      <circle cx="19" cy="15" r="4.5" fill="var(--color-primary)" />
      <path d="M11 34c0-4.6 3.7-8 8.2-8s8.3 3.4 8.3 8" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M27 22h9m0 0-4-4m4 4-4 4" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function WordMark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Logo />
      <div className="leading-tight">
        <div className="text-base font-bold tracking-wide text-foreground">PRARAMBH</div>
        <div className="text-[11px] text-muted-foreground">{subtitle ?? "AI-assisted public service recruitment"}</div>
      </div>
    </div>
  );
}

export function DemoBadge({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-highlight/40 bg-highlight-soft px-2 py-0.5 text-[11px] font-semibold text-highlight-foreground">
      <span aria-hidden>●</span>
      {label}
    </span>
  );
}

/* ---------------------------------- Layout ---------------------------------- */

export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  return <As className={cn("card-surface p-4", className)}>{children}</As>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{children}</h2>
      {action}
    </div>
  );
}

/* --------------------------------- Controls --------------------------------- */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline: "border border-input bg-card text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  sm: "h-9 px-3 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: keyof typeof sizes }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  params,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  to: string;
  params?: Record<string, string>;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  hint,
  error,
  id,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-12 w-full rounded-md border bg-card px-3 text-base text-foreground placeholder:text-muted-foreground/70",
          error ? "border-destructive" : "border-input",
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/* --------------------------------- Feedback --------------------------------- */

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/30 bg-success-soft text-success",
  warning: "border-warning/40 bg-warning-soft text-warning-foreground",
  danger: "border-destructive/30 bg-destructive-soft text-destructive",
  info: "border-secondary/30 bg-secondary-soft text-secondary",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold", toneClasses[tone])}>
      {children}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label ?? "Progress"}</span>
        <span>{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScoreBar({ label, score, evidence }: { label: string; score: number; evidence?: string | undefined }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">{score} / 100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", score >= 80 ? "bg-success" : score >= 65 ? "bg-primary" : "bg-warning")}
          style={{ width: `${score}%` }}
        />
      </div>
      {evidence && <p className="text-xs leading-relaxed text-muted-foreground">Evidence: {evidence}</p>}
    </div>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: Tone; title: string; children?: ReactNode }) {
  return (
    <div className={cn("rounded-md border px-3 py-2.5 text-sm", toneClasses[tone])}>
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-xs leading-relaxed opacity-90">{children}</div>}
    </div>
  );
}
