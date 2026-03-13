import { LocateFixed, Minus, Plus, SendHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsApi } from "~/modules/creators-map/lib/google-maps";
import type { CreatorMapModel } from "~/modules/creators-map/types";

const BH_CENTER = { lat: -19.9208, lng: -43.9378 };

const MAP_STYLES = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "water", stylers: [{ color: "#dbeafe" }] }
];

type GoogleCreatorsMapProps = {
  creators: CreatorMapModel[];
  selectedCreatorId: string | null;
  onSelectCreator: (creatorId: string) => void;
  className?: string;
};

export function GoogleCreatorsMap({ creators, selectedCreatorId, onSelectCreator, className }: GoogleCreatorsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const selectedCreator = useMemo(
    () => creators.find((creator) => creator.id === selectedCreatorId) ?? creators[0],
    [creators, selectedCreatorId]
  );

  useEffect(() => {
    let isActive = true;

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }

      if (!googleMapsApiKey) {
        setMapError("Defina VITE_GOOGLE_MAPS_API_KEY para carregar o mapa.");
        return;
      }

      try {
        const googleMaps = await loadGoogleMapsApi(googleMapsApiKey);

        if (!isActive || !mapRef.current) {
          return;
        }

        mapInstanceRef.current = new googleMaps.maps.Map(mapRef.current, {
          center: BH_CENTER,
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          styles: MAP_STYLES
        });

        setMapError(null);
      } catch (error) {
        setMapError(error instanceof Error ? error.message : "Nao foi possivel carregar o Google Maps.");
      }
    }

    void initializeMap();

    return () => {
      isActive = false;
    };
  }, [googleMapsApiKey]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }
    const googleMaps = (window as any).google;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = creators.map((creator) => {
      const isSelected = creator.id === selectedCreator?.id;
      const marker = new googleMaps.maps.Marker({
        map,
        position: { lat: creator.latitude, lng: creator.longitude },
        title: creator.name,
        label: {
          text: creator.rating.toFixed(1),
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "700"
        },
        icon: {
          path: googleMaps.maps.SymbolPath.CIRCLE,
          fillColor: isSelected ? "#895AF6" : "#94A3B8",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: isSelected ? 16 : 13
        }
      });

      marker.addListener("click", () => onSelectCreator(creator.id));
      return marker;
    });

    if (creators.length > 0) {
      const bounds = new googleMaps.maps.LatLngBounds();
      creators.forEach((creator) => bounds.extend({ lat: creator.latitude, lng: creator.longitude }));
      map.fitBounds(bounds, 70);
    }
  }, [creators, onSelectCreator, selectedCreator?.id]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCreator) {
      return;
    }

    map.panTo({ lat: selectedCreator.latitude, lng: selectedCreator.longitude });
  }, [selectedCreator]);

  function updateZoom(delta: number) {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    const currentZoom = map.getZoom() ?? 12;
    map.setZoom(Math.max(9, Math.min(17, currentZoom + delta)));
  }

  function focusInUserLocation() {
    const map = mapInstanceRef.current;
    if (!map || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
      map.setZoom(13);
    });
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute bottom-36 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => updateZoom(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          aria-label="Aproximar mapa"
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          onClick={() => updateZoom(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          aria-label="Afastar mapa"
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          onClick={focusInUserLocation}
          className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#895af6] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          aria-label="Ir para minha localizacao"
        >
          <SendHorizontal size={18} />
        </button>
      </div>

      {mapError ? (
        <div className="absolute inset-x-4 top-4 z-20 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-center gap-2 font-medium">
            <LocateFixed size={16} />
            Google Maps indisponivel
          </div>
          <p className="mt-1 text-xs">{mapError}</p>
        </div>
      ) : null}
    </div>
  );
}
