import { useEffect, useRef, useState } from "react";
import type { Hospital } from "@/data/hospitals";
import { NETWORK_COLORS } from "@/data/hospitals";

declare global {
  interface Window {
    google?: typeof google;
    __initHospitalMap?: () => void;
    __mapReady?: boolean;
  }
}

let scriptLoading: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.__mapReady && window.google?.maps) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve, reject) => {
    window.__initHospitalMap = () => {
      window.__mapReady = true;
      resolve();
    };
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      reject(new Error("Maps key missing"));
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initHospitalMap${channel ? `&channel=${channel}` : ""}`;
    s.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(s);
  });
  return scriptLoading;
}

// Subtle, paper-like map style
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f1e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#2b2b2b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e8" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c8c2b3" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dfe7d3" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e5e0d3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fff7d6" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e8c97a" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#aacbe0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1a3a52" }] },
];

interface MapProps {
  hospitals: Hospital[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  home: { lat: number; lng: number } | null;
  pinnedIds: Set<string>;
}

export function HospitalMap({ hospitals, selectedId, onSelect, home, pinnedIds }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  // init map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        mapRef.current = new google.maps.Map(containerRef.current, {
          center: { lat: 40.7589, lng: -73.9851 },
          zoom: 11,
          styles: MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          backgroundColor: "#f5f1e8",
        });
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  // hospital markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google) return;
    const existing = markersRef.current;
    const seen = new Set<string>();
    for (const h of hospitals) {
      seen.add(h.id);
      let m = existing.get(h.id);
      const color = NETWORK_COLORS[h.network];
      const isSelected = selectedId === h.id;
      const isPinned = pinnedIds.has(h.id);
      const scale = isSelected ? 14 : 10;
      const icon: google.maps.Symbol = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: isPinned ? "#000" : "#fff",
        strokeWeight: isPinned ? 3 : 2,
        scale,
      };
      if (!m) {
        m = new google.maps.Marker({
          position: { lat: h.lat, lng: h.lng },
          map,
          title: h.name,
          icon,
          zIndex: isSelected ? 999 : 1,
        });
        m.addListener("click", () => onSelect(h.id));
        existing.set(h.id, m);
      } else {
        m.setIcon(icon);
        m.setZIndex(isSelected ? 999 : isPinned ? 50 : 1);
        m.setMap(map);
      }
    }
    // remove stale
    for (const [id, m] of existing) {
      if (!seen.has(id)) {
        m.setMap(null);
        existing.delete(id);
      }
    }
  }, [hospitals, selectedId, pinnedIds, onSelect]);

  // pan to selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const h = hospitals.find((x) => x.id === selectedId);
    if (h) {
      map.panTo({ lat: h.lat, lng: h.lng });
      if ((map.getZoom() ?? 0) < 13) map.setZoom(13);
    }
  }, [selectedId, hospitals]);

  // home marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google) return;
    if (!home) {
      homeMarkerRef.current?.setMap(null);
      homeMarkerRef.current = null;
      return;
    }
    if (!homeMarkerRef.current) {
      homeMarkerRef.current = new google.maps.Marker({
        position: home,
        map,
        title: "Home",
        icon: {
          path: "M -8 0 L 0 -10 L 8 0 L 8 8 L -8 8 Z",
          fillColor: "#facc15",
          fillOpacity: 1,
          strokeColor: "#000",
          strokeWeight: 2,
          scale: 1.2,
          anchor: new google.maps.Point(0, 0),
        },
        zIndex: 1000,
      });
    } else {
      homeMarkerRef.current.setPosition(home);
    }
  }, [home]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-muted p-6 text-center text-sm">
        <div>
          <p className="font-semibold">Map couldn&apos;t load</p>
          <p className="mt-1 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  return <div ref={containerRef} className="h-full w-full" />;
}
