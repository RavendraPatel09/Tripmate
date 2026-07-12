"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons issue in Next.js
const fixLeafletIcons = async () => {
  const L = (await import("leaflet")).default;
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

export function JourneyMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcons().then(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-xl" />;
  }

  // Mock coordinates for Bhopal to Manali route
  const startCoords: [number, number] = [23.2599, 77.4126]; // Bhopal
  const endCoords: [number, number] = [32.2396, 77.1887]; // Manali
  
  const polyline: [number, number][] = [
    startCoords,
    [28.6139, 77.2090], // Delhi
    [30.7333, 76.7794], // Chandigarh
    endCoords
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border">
      <MapContainer 
        center={[27.5, 77.3]} 
        zoom={5} 
        scrollWheelZoom={false} 
        className="w-full h-full min-h-[400px] z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={startCoords}>
          <Popup>Start: Bhopal</Popup>
        </Marker>
        <Marker position={endCoords}>
          <Popup>Destination: Manali</Popup>
        </Marker>
        <Polyline positions={polyline} color="#0f172a" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
}
