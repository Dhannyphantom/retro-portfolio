"use client";

export default function TerminalWindow({
  title,
  hint,
  children,
  className = "",
  style = {},
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`retro-terminal-window ${className}`} style={style}>
      <div className="retro-window-bar">
        <span className="retro-win-dot retro-win-dot-r" />
        <span className="retro-win-dot retro-win-dot-y" />
        <span className="retro-win-dot retro-win-dot-g" />
        <span className="retro-win-title">{title}</span>
        {hint && <span className="retro-win-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
