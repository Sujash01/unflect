/** Abstract, deterministic artwork used where real project imagery is not yet available. */
export function GenerativeArt({ seed = 0 }: { seed?: number }) {
  const rot = seed * 37;
  const rings = [18, 34, 52, 72, 94];
  const gx = 30 + ((seed * 23) % 40);
  const gy = 25 + ((seed * 31) % 45);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,var(--color-indigo-deep),#0B0F12)]">
      <div
        className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-precision)] group-hover:scale-110"
        style={{ background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(111,168,189,0.42), transparent 55%)` }}
      />
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full transition-transform duration-700 ease-[var(--ease-precision)] group-hover:scale-105 group-hover:rotate-[2deg]" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform={`rotate(${rot} 100 75)`}>
          {rings.map((r, i) => (
            <circle key={r} cx={100 + (seed % 2 ? 16 : -16)} cy="75" r={r} stroke="rgba(234,232,227,0.16)" strokeWidth="0.6" strokeDasharray={i % 2 ? "1 4" : undefined} />
          ))}
          <path d="M20 118 C60 40, 120 150, 180 36" stroke="rgba(111,168,189,0.9)" strokeWidth="0.9" />
          <circle cx="180" cy="36" r="2.6" fill="rgba(234,232,227,0.9)" />
          <circle cx="20" cy="118" r="2.6" fill="rgba(234,232,227,0.9)" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-grid-fine opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>
  );
}
