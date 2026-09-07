import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  always?: boolean; // kept for API compat — controls whether the marching-ants border shows always or only on hover
  radius?: number;  // kept for API compat, has no visual effect (retro = sharp corners everywhere)
  padding?: number;
  hoverLift?: boolean;
  title?: string;   // when set, renders a retro OS-style title bar above the content
  className?: string;
  style?: React.CSSProperties;
};

// A retro "window" panel — flat bordered box, optional title bar with fake
// window controls, and a dashed "marching ants" border that lights up on
// hover (or always, via `always`) instead of the old rotating-gradient glow.
export default function DiagonalCard({ children, always = true, padding = 2, hoverLift = false, title, className = "", style = {} }: Props) {
  return (
    <div
      className={cn("win relative", always && "always-march", "diag-wrap", hoverLift && "hover-card", className)}
      style={{ padding, ...style }}
    >
      <span className="marching-border" />
      {title && (
        <div className="win-bar -m-[2px] mb-0">
          <span className="win-title">{title}</span>
          <span className="win-controls">
            <span className="win-dot">▢</span>
            <span className="win-dot">×</span>
          </span>
        </div>
      )}
      <div className="relative overflow-hidden bg-ink2 h-full">{children}</div>
    </div>
  );
}
