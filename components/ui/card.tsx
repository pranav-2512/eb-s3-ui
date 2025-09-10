import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded-lg shadow">{children}</div>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}