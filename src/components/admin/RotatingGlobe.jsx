/**
 * A stylized 2.5D rotating globe built from pure SVG + CSS keyframes (no
 * WebGL/Three.js dependency). Several vertical "meridian" ellipses animate
 * their horizontal scale out of phase with each other to read as a sphere
 * continuously spinning on its axis. A fixed marker sits over India's
 * approximate position and pulses brighter than the rest of the globe so
 * the dashboard visually "focuses" there regardless of rotation phase.
 */
export default function RotatingGlobe() {
  const meridians = [0, 1, 2, 3, 4, 5];

  return (
    <div className="admin-globe-wrap" aria-hidden="true">
      <svg className="admin-globe-svg" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="globeSphere" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#13303a" />
            <stop offset="55%" stopColor="#0a1a22" />
            <stop offset="100%" stopColor="#050a0d" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="150" fill="url(#globeSphere)" stroke="#1f5a44" strokeWidth="1.5" />

        {/* Latitude rings (static) */}
        <ellipse cx="200" cy="200" rx="150" ry="36" fill="none" stroke="#00e599" strokeOpacity="0.18" />
        <ellipse cx="200" cy="140" rx="128" ry="26" fill="none" stroke="#00e599" strokeOpacity="0.14" />
        <ellipse cx="200" cy="260" rx="128" ry="26" fill="none" stroke="#00e599" strokeOpacity="0.14" />

        {/* Rotating meridian lines */}
        <g className="admin-globe-meridians">
          {meridians.map((i) => (
            <ellipse
              key={i}
              className={`admin-globe-meridian admin-globe-meridian-${i}`}
              cx="200"
              cy="200"
              rx="150"
              ry="150"
              fill="none"
              stroke="#00e599"
              strokeOpacity="0.28"
              strokeWidth="1"
            />
          ))}
        </g>

        <circle cx="200" cy="200" r="150" fill="none" stroke="#00e599" strokeOpacity="0.4" strokeWidth="1.5" />

        {/* India focus marker (fixed — doesn't rotate with the meridians) */}
        <g className="admin-globe-india-marker">
          <circle cx="238" cy="196" r="5" fill="none" stroke="#ff3344" strokeWidth="2">
            <animate attributeName="r" values="5;20" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="238" cy="196" r="4" fill="#ff3344" />
          <text x="250" y="200" fill="#ffffff" fontSize="11" fontFamily="monospace">
            INDIA
          </text>
        </g>
      </svg>
    </div>
  );
}
