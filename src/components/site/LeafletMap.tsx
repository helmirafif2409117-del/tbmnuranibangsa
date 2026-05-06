import { useEffect, useRef } from "react";

const LAT = -7.9649;
const LNG = 112.6468;

export function LeafletMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current) return;

      const map = L.map(ref.current, { scrollWheelZoom: false }).setView([LAT, LNG], 16);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;transform:translate(-50%,-100%)">
          <div style="background:oklch(0.7 0.17 45);width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 6px 14px rgba(0,0,0,.25);display:grid;place-items:center;">
            <span style="transform:rotate(45deg);font-size:18px">📚</span>
          </div>
        </div>`,
        iconSize: [36, 36],
      });

      L.marker([LAT, LNG], { icon })
        .addTo(map)
        .bindPopup(
          `<strong>TBM Nurani Bangsa</strong><br/>Jl. Hamid Rusdi No.91, Bunulrejo<br/>Blimbing, Kota Malang`,
        )
        .openPopup();
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="w-full h-full rounded-3xl overflow-hidden" />;
}
