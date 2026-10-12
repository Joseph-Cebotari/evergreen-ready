// A seismograph trace used as the timeline's backbone on the first screen:
// a large burst for the 1700 Cascadia earthquake, a smaller one for 2001,
// and a dashed line for the stretch nobody has recorded yet.
// It is decoration for the timeline text beside it, so it is hidden from
// screen readers.

const WIDTH = 1200;
const HEIGHT = 160;
const MID = HEIGHT / 2;
const RECORDED_UNTIL = 840;

const bump = (x, center, spread) => Math.exp(-(((x - center) / spread) ** 2));

export function tracePath() {
  const points = [];
  for (let x = 0; x <= RECORDED_UNTIL; x += 3) {
    const envelope = 1.5 + 64 * bump(x, 200, 52) + 36 * bump(x, 600, 40);
    // Two sine waves at unrelated frequencies read as noise but stay deterministic.
    const wave = Math.sin(x * 0.83) * Math.cos(x * 0.29 + 1.3);
    points.push(`${x},${(MID + envelope * wave).toFixed(1)}`);
  }
  return `M${points.join(' L')}`;
}

export default function SeismoTrace() {
  return (
    <svg
      className="seismo"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="seismo-recorded" d={tracePath()} />
      <line className="seismo-future" x1={RECORDED_UNTIL} y1={MID} x2={WIDTH} y2={MID} />
    </svg>
  );
}
