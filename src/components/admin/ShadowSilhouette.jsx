export default function ShadowSilhouette() {
  return (
    <svg
      className="admin-shadow-silhouette"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="shadowFade" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#0d0f14" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d0f14" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Hooded head */}
      <ellipse cx="200" cy="150" rx="62" ry="72" fill="url(#shadowFade)" />
      {/* Shoulders / cloak */}
      <path
        d="M80 600 C80 380 120 260 200 240 C280 260 320 380 320 600 Z"
        fill="url(#shadowFade)"
      />
      {/* Hood shading */}
      <ellipse cx="200" cy="158" rx="40" ry="48" fill="#06070a" opacity="0.6" />
    </svg>
  );
}
