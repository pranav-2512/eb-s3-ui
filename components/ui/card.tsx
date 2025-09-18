import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export const Card = React.forwardRef<HTMLDivElement, DivProps>((
  { children, className = "", ...props },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, DivProps>((
  { children, className = "", ...props },
  ref
) => {
  return (
    <div ref={ref} className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";