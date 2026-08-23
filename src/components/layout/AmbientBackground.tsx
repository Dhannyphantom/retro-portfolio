export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute -top-[10%] -right-[8%] w-[560px] h-[560px] rounded-full blur-[10px] animate-drift"
        style={{ background: "radial-gradient(circle, #8B2FE0 0%, transparent 70%)", opacity: 0.06 }}
      />
      <div
        className="absolute -bottom-[15%] -left-[10%] w-[480px] h-[480px] rounded-full blur-[10px] animate-drift [animation-direction:reverse]"
        style={{ background: "radial-gradient(circle, #4C1D95 0%, transparent 70%)", opacity: 0.05 }}
      />
    </div>
  );
}
