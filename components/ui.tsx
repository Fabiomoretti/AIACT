import { clsx } from "clsx";
import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  asChild?: boolean;
};

export function Button({ className, variant = "primary", asChild = false, children, ...props }: ButtonProps) {
  const buttonClassName = clsx(
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
    variant === "primary" && "brand-gradient text-cream shadow-brand hover:brightness-105",
    variant === "secondary" && "border border-line bg-panel text-ink hover:border-rose/40 hover:bg-brandSoft",
    variant === "ghost" && "text-ink hover:bg-brandSoft",
    variant === "danger" && "bg-danger text-cream hover:bg-danger/90",
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: clsx(buttonClassName, child.props.className)
    });
  }

  return (
    <button
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "border-line bg-panel text-muted",
        tone === "success" && "border-success/25 bg-success/10 text-success",
        tone === "warning" && "border-warning/30 bg-warning/15 text-amber-700",
        tone === "danger" && "border-danger/25 bg-danger/10 text-danger",
        tone === "brand" && "border-rose/20 bg-brandSoft text-rose"
      )}
    >
      {children}
    </span>
  );
}

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rounded-lg border border-line bg-panel shadow-panel", className)} {...props} />;
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{children}</p>;
}
