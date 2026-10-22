import { useEffect, useRef } from "react";
import { radarSvgMarkup } from "../../data/radarSvgMarkup.js";

/**
 * Renders the exact original orthographic world-map SVG (Kochi breach beacon +
 * Nepal trace beacon) untouched. The map is injected via dangerouslySetInnerHTML
 * because it's a large, hand-authored vector asset — re-typing it as JSX would
 * risk altering path data, which the brief explicitly says not to touch.
 *
 * `nepalBeaconActive` toggles the #nepal-beacon group's visibility to mirror the
 * original activateNepalBeacon() behavior once Phase 3 is cleared.
 */
export default function RadarMap({ nepalBeaconActive }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const beacon = containerRef.current?.querySelector("#nepal-beacon");
    if (beacon) beacon.style.display = nepalBeaconActive ? "" : "none";
  }, [nepalBeaconActive]);

  return (
    <div
      id="radar-map-box"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: radarSvgMarkup }}
    />
  );
}
