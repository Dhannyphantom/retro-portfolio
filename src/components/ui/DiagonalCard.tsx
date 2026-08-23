import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  always?: boolean;
  radius?: number;
  padding?: number;
  hoverLift?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function DiagonalCard({ children, always = true, radius = 12, padding = 2, hoverLift = false, className = "", style = {} }: Props) {
  return (
    <div
      className={cn("diag-wrap", !always && "diag-wrap-hover", className)}
      style={{ borderRadius: radius, padding, ...style }}
    >
      <div className={cn("diag-border-spin", !always && "paused-until-hover")} />
      <div
        className={cn("relative overflow-hidden bg-ink2 h-full", hoverLift && "transition-transform duration-300 hover:-translate-y-1.5")}
        style={{ borderRadius: Math.max(radius - 2, 2) }}
      >
        {children}
      </div>
    </div>
  );
}
