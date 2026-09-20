import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlayerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  primary?: boolean;
};

export function PlayerButton({ label, children, primary = false, className, ...props }: PlayerButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(primary ? "player-button-primary" : "player-button", className)}
      {...props}
    >
      {children}
    </button>
  );
}