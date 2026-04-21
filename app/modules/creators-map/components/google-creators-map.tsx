/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
  type Renderer,
} from "@googlemaps/markerclusterer";
import { Building2, Locate, MapPin, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getFirstName } from "~/lib/utils";
import { loadGoogleMapsApi } from "~/modules/creators-map/lib/google-maps";
import type { CreatorMapModel } from "~/modules/creators-map/types";
import type {
  DistanceFilter,
  MapBounds,
} from "../hooks/use-creators-map-controller";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_ZOOM = 12;

/**
 * Zoom threshold for clustering. Markers are clustered when zoom < this value.
 * Tweak independently from map initialization logic.
 */
const CLUSTER_ZOOM_THRESHOLD = 12;

const DISTANCE_RADIUS_M: Record<DistanceFilter, number> = {
  all: 3000,
  "1km": 1000,
  "3km": 3000,
  "5km": 5000,
};

const MOBILE_COLLAPSED_SHEET_HEIGHT = 76;

// ─── Marker HTML builder ──────────────────────────────────────────────────────

function buildCreatorMarkerEl(
  creator: CreatorMapModel,
  isSelected: boolean,
): HTMLElement {
  const el = document.createElement("div");
  // Selected markers are slightly larger (48px vs 42px) for clear visual feedback
  const size = isSelected ? 48 : 42;
  const totalH = isSelected ? 66 : 58;
  el.style.cssText = `position:relative;cursor:pointer;width:${size}px;height:${totalH}px;`;

  const initial = creator.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
  const hasAvatar = Boolean(creator.avatarUrl);
  const borderColor = isSelected ? "#895af6" : "#ffffff";
  const outline = isSelected
    ? "outline:4px solid rgba(137,90,246,0.25);outline-offset:2px;"
    : "";
  const shadow = isSelected
    ? "box-shadow:0 4px 16px rgba(137,90,246,0.45);"
    : "box-shadow:0 2px 8px rgba(0,0,0,0.2);";
  const badgeBg = isSelected ? "#895af6" : "#ffffff";
  const badgeColor = isSelected ? "#ffffff" : "#895af6";
  const badgeBorder = isSelected ? "#895af6" : "#e2d9fe";
  const badgeText =
    creator.distanceKm != null
      ? `${creator.distanceKm.toFixed(1)}km`
      : creator.rating > 0
        ? `★${creator.rating.toFixed(1)}`
        : creator.name.split(/\s+/)[0] ?? "";

  el.innerHTML = `
    <div style="width:${size}px;height:${size}px;border-radius:50%;border:3px solid ${borderColor};${shadow}${outline}overflow:hidden;background:#e9d5ff;display:flex;align-items:center;justify-content:center;">
      ${
        hasAvatar
          ? `<img src="${creator.avatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:${isSelected ? 18 : 16}px;font-weight:700;color:#7c3aed">${initial}</span>`
          : `<span style="font-size:${isSelected ? 18 : 16}px;font-weight:700;color:#7c3aed">${initial}</span>`
      }
    </div>
    <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);background:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};font-size:10px;font-weight:700;padding:1px 5px;border-radius:5px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.12);">${badgeText}</div>
  `;
  return el;
}

// ─── Preview card HTML builder ────────────────────────────────────────────────

function buildPreviewCardEl(
  creator: CreatorMapModel,
  options?: { compact?: boolean },
): HTMLDivElement {
  const compact = options?.compact ?? false;
  const creatorFirstName = getFirstName(creator.name);
  const el = document.createElement("div");
  el.style.cssText = `background:rgba(255,255,255,0.98);border-radius:${compact ? 18 : 14}px;padding:${compact ? 12 : 14}px;border:1px solid rgba(137,90,246,0.18);box-shadow:0 12px 36px rgba(15,23,42,0.16);opacity:0;transition:opacity 150ms ease-out;width:${compact ? 220 : 272}px;backdrop-filter:blur(10px);`;

  const initial = creator.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const avatarHtml = creator.avatarUrl
    ? `<img src="${creator.avatarUrl}" alt="" style="width:48px;height:48px;border-radius:10px;object-fit:cover;flex-shrink:0;border:2px solid #e9d5ff" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div style="display:none;width:48px;height:48px;border-radius:10px;background:#e9d5ff;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;font-weight:700;color:#7c3aed">${initial}</div>`
    : `<div style="width:48px;height:48px;border-radius:10px;background:#e9d5ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;font-weight:700;color:#7c3aed">${initial}</div>`;

  const regionHtml = creator.region
    ? `<div style="font-size:11px;color:#64748b;margin-top:2px;">${creator.region}</div>`
    : "";

  const distanceHtml = creator.distanceKm != null
    ? `<div style="display:inline-flex;align-items:center;gap:3px;margin-top:3px;background:#f3f0ff;border-radius:999px;padding:${compact ? "2px 7px" : "1px 5px"};font-size:10px;font-weight:700;color:#895af6;">${creator.distanceKm.toFixed(1)}km de você</div>`
    : "";

  const nicheHtml = creator.specialty
    ? `<div style="flex:1;background:#f8fafc;border-radius:12px;padding:6px 9px;font-size:10px;color:#64748b;overflow:hidden;">Nicho: <strong style="color:#0f172a;">${creator.specialty}</strong></div>`
    : "";

  const priceHtml = creator.priceFrom != null
    ? `<div style="flex:1;background:#f8fafc;border-radius:12px;padding:6px 9px;font-size:10px;color:#64748b;text-align:right;">A partir de<br/><strong style="font-size:13px;color:#0f172a;">R$ ${creator.priceFrom}</strong></div>`
    : "";

  const tagsRowHtml = !compact && (nicheHtml || priceHtml)
    ? `<div style="display:flex;gap:6px;margin-bottom:10px;">${nicheHtml}${priceHtml}</div>`
    : "";

  el.innerHTML = `
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      ${avatarHtml}
      <div style="min-width:0;flex:1;">
        <div style="font-size:${compact ? 12 : 13}px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${creatorFirstName}</div>
        ${regionHtml}
        ${distanceHtml}
      </div>
    </div>
    ${tagsRowHtml}
    <a href="/criador/${creator.id}" style="display:block;text-align:center;background:#895af6;color:white;border-radius:12px;padding:${compact ? "8px" : "7px"};font-size:12px;font-weight:600;text-decoration:none;">Ver perfil completo</a>
  `;
  return el;
}

// ─── Cluster renderer ─────────────────────────────────────────────────────────

const clusterRenderer: Renderer = {
  render({ count, position }) {
    const el = document.createElement("div");
    el.style.cssText =
      "width:44px;height:44px;border-radius:50%;background:#895af6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:3px solid #fff;box-shadow:0 2px 8px rgba(137,90,246,0.45);cursor:pointer;";
    el.textContent = String(count);
    return new (window as any).google.maps.marker.AdvancedMarkerElement({
      position,
      content: el,
    });
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

type GoogleCreatorsMapProps = {
  creators: CreatorMapModel[];
  selectedCreatorId: string;
  onSelectCreator: (creatorId: string) => void;
  distanceFilter: DistanceFilter;
  companyLatLng: { lat: number; lng: number };
  onSearchInArea: (bounds: MapBounds) => void;
  onReturnToCompany: () => void;
  className?: string;
  uiVariant?: "desktop" | "mobile";
  showCreatorCountBadge?: boolean;
  topInset?: number;
  bottomInset?: number;
  mobileSheetState?: "collapsed" | "medium" | "expanded";
};

export function GoogleCreatorsMap({
  creators,
  selectedCreatorId,
  onSelectCreator,
  distanceFilter,
  companyLatLng,
  onSearchInArea,
  onReturnToCompany,
  className,
  uiVariant = "desktop",
  showCreatorCountBadge = true,
  topInset = 16,
  bottomInset = 0,
  mobileSheetState = "collapsed",
}: GoogleCreatorsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const advancedMarkersRef = useRef<Array<{ id: string; marker: any }>>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const companyPinRef = useRef<any>(null);
  const proximityCircleRef = useRef<any>(null);
  const previewOverlayRef = useRef<any>(null);
  const isProgrammaticMoveRef = useRef(false);

  const [mapError, setMapError] = useState<string | null>(null);
  const [showSearchHere, setShowSearchHere] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined;
  const mapId =
    (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined) ??
    "DEMO_MAP_ID";
  const isMobileUi = uiVariant === "mobile";
  const shouldShowMobilePreview = !isMobileUi || mobileSheetState === "collapsed";
  const topOffset = isMobileUi ? topInset + 12 : 16;
  const mobileFloatingBottom = bottomInset + 18;
  const showSearchButton = !isMobileUi || mobileSheetState === "collapsed";
  const mobileControlButtonClassName =
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm hover:bg-slate-50";

  // ── Initialize map ──
  useEffect(() => {
    let isActive = true;

    async function init() {
      if (!mapRef.current) return;

      if (!googleMapsApiKey) {
        setMapError("Defina VITE_GOOGLE_MAPS_API_KEY para carregar o mapa.");
        return;
      }

      try {
        const g = await loadGoogleMapsApi(googleMapsApiKey);
        if (!isActive || !mapRef.current) return;

        const map = new g.maps.Map(mapRef.current, {
          center: companyLatLng,
          zoom: DEFAULT_ZOOM,
          mapId,
          disableDefaultUI: true,
          gestureHandling: "greedy",
        });

        mapInstanceRef.current = map;
        setMapError(null);

        // ── Company pin via OverlayView ──
        class CompanyPinOverlay extends g.maps.OverlayView {
          private el: HTMLDivElement;
          private pos: any;

          constructor(pos: any) {
            super();
            this.pos = pos;
            const div = document.createElement("div");
            div.style.cssText = "position:absolute;cursor:default;";
            div.innerHTML = `
              <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%)">
                <div style="position:absolute;width:64px;height:64px;border-radius:16px;background:rgba(137,90,246,0.15);animation:company-pulse 2s ease-in-out infinite;"></div>
                <div style="position:relative;width:44px;height:44px;background:linear-gradient(135deg,#895af6,#6a2fc4);border-radius:12px;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(137,90,246,0.5);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div style="margin-top:6px;background:white;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:600;color:#1e293b;box-shadow:0 2px 8px rgba(0,0,0,0.12);white-space:nowrap;display:flex;align-items:center;gap:4px;">
                  <div style="width:6px;height:6px;border-radius:50%;background:#895af6;animation:dot-pulse 1.5s ease-in-out infinite;"></div>Sua empresa
                </div>
              </div>
              <style>
                @keyframes company-pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.25);opacity:0.15}}
                @keyframes dot-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
              </style>
            `;
            this.el = div;
          }

          onAdd() {
            this.getPanes()!.overlayLayer.appendChild(this.el);
          }

          draw() {
            const p = this.getProjection().fromLatLngToDivPixel(this.pos);
            if (!p) return;
            this.el.style.left = `${p.x}px`;
            this.el.style.top = `${p.y}px`;
          }

          onRemove() {
            this.el.parentNode?.removeChild(this.el);
          }
        }

        const companyPin = new CompanyPinOverlay(
          new g.maps.LatLng(companyLatLng.lat, companyLatLng.lng),
        );
        companyPin.setMap(map);
        companyPinRef.current = companyPin;

        // ── Proximity circle ──
        const circle = new g.maps.Circle({
          map,
          center: companyLatLng,
          radius: DISTANCE_RADIUS_M[distanceFilter],
          strokeColor: "#895af6",
          strokeOpacity: 0.35,
          strokeWeight: 2,
          fillOpacity: 0,
        });
        proximityCircleRef.current = circle;

        // ── Map movement detection ──
        map.addListener("dragend", () => {
          if (!isProgrammaticMoveRef.current) setShowSearchHere(true);
        });
        map.addListener("zoom_changed", () => {
          if (!isProgrammaticMoveRef.current) setShowSearchHere(true);
        });
        map.addListener("idle", () => {
          isProgrammaticMoveRef.current = false;
        });
      } catch (err) {
        setMapError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o Google Maps.",
        );
      }
    }

    void init();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMapsApiKey, mapId]);

  // ── Update proximity circle radius when distanceFilter changes ──
  useEffect(() => {
    proximityCircleRef.current?.setRadius(DISTANCE_RADIUS_M[distanceFilter]);
  }, [distanceFilter]);

  // ── Rebuild markers + clusterer when creators list changes ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const g = (window as any).google;

    // Tear down previous clusterer and markers
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    advancedMarkersRef.current.forEach(({ marker }) => {
      marker.map = null;
    });
    advancedMarkersRef.current = [];

    const newMarkers: any[] = [];

    creators.forEach((creator) => {
      const isSelected = creator.id === selectedCreatorId;
      const marker = new g.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: creator.latitude, lng: creator.longitude },
        title: creator.name,
        content: buildCreatorMarkerEl(creator, isSelected),
        zIndex: isSelected ? 100 : 1,
      });
      marker.addListener("click", () => onSelectCreator(creator.id));
      advancedMarkersRef.current.push({ id: creator.id, marker });
      newMarkers.push(marker);
    });

    clustererRef.current = new MarkerClusterer({
      map,
      markers: newMarkers,
      renderer: clusterRenderer,
      algorithm: new SuperClusterAlgorithm({
        minPoints: 3,
        maxZoom: CLUSTER_ZOOM_THRESHOLD,
      }),
    });

    if (creators.length > 0) {
      const bounds = new g.maps.LatLngBounds();
      creators.forEach((c: CreatorMapModel) =>
        bounds.extend({ lat: c.latitude, lng: c.longitude }),
      );
      bounds.extend(companyLatLng);
      isProgrammaticMoveRef.current = true;
      map.fitBounds(bounds, 80);
    }
  }, [creators, onSelectCreator, companyLatLng]);

  // ── Update only the two affected markers when selection changes ──
  useEffect(() => {
    advancedMarkersRef.current.forEach(({ id, marker }) => {
      const isSelected = id === selectedCreatorId;
      const creator = creators.find((c) => c.id === id);
      if (!creator) return;
      marker.content = buildCreatorMarkerEl(creator, isSelected);
      marker.zIndex = isSelected ? 100 : 1;
    });
  }, [selectedCreatorId, creators]);

  // ── Pan to selected creator ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    const creator = creators.find((c) => c.id === selectedCreatorId);
    if (!map || !creator) return;
    isProgrammaticMoveRef.current = true;
    map.panTo({ lat: creator.latitude, lng: creator.longitude });
  }, [selectedCreatorId, creators]);

  // ── Preview overlay (OverlayView positioned at creator's coordinates) ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const g = (window as any).google;
    const container = containerRef.current;

    // Remove previous overlay
    previewOverlayRef.current?.setMap(null);
    previewOverlayRef.current = null;

    const creator = creators.find((c) => c.id === selectedCreatorId);
    if (!creator || !container || !shouldShowMobilePreview) return;

    const cardEl = buildPreviewCardEl(creator, { compact: isMobileUi });
    const ARROW_GAP = 12;
    const MARKER_H = 58;
    const MARKER_OFFSET_Y = 18;

    class CreatorPreviewOverlay extends g.maps.OverlayView {
      private el: HTMLDivElement;
      private latLng: any;

      constructor(latLng: any, el: HTMLDivElement) {
        super();
        this.latLng = latLng;
        this.el = el;
      }

      onAdd() {
        this.el.style.position = "absolute";
        this.el.style.zIndex = "200";
        this.el.style.pointerEvents = "auto";
        this.getPanes()!.floatPane.appendChild(this.el);
      }

      draw() {
        const point = this.getProjection().fromLatLngToDivPixel(this.latLng);
        if (!point) return;

        const mapW = this.getMap()!.getDiv().offsetWidth;
        const mapH = this.getMap()!.getDiv().offsetHeight;

        const cardW = this.el.offsetWidth;
        const cardH = this.el.offsetHeight;
        const horizontalPadding = isMobileUi ? 12 : 8;
        const topSafeInset = isMobileUi ? topInset + 10 : 8;
        const collapsedSheetInset =
          isMobileUi && mobileSheetState === "collapsed"
            ? MOBILE_COLLAPSED_SHEET_HEIGHT + 12
            : 0;
        const bottomSafeInset = isMobileUi
          ? bottomInset + collapsedSheetInset
          : 8;
        const usableBottom = mapH - bottomSafeInset;

        // Position card beside the avatar (right side, flip to left if needed)
        const MARKER_AVATAR_SIZE = 48;
        const MARKER_TOTAL_H = 66;
        const SIDE_GAP = 10;
        const avatarCenterY = point.y - MARKER_TOTAL_H + MARKER_AVATAR_SIZE / 2;
        const avatarHalfW = MARKER_AVATAR_SIZE / 2;

        let left = point.x + avatarHalfW + SIDE_GAP;
        if (left + cardW + horizontalPadding > mapW) {
          left = point.x - avatarHalfW - SIDE_GAP - cardW;
        }
        left = Math.max(horizontalPadding, Math.min(left, mapW - cardW - horizontalPadding));

        let top = avatarCenterY - cardH / 2;
        top = Math.max(topSafeInset, Math.min(top, usableBottom - cardH));

        this.el.style.left = `${left}px`;
        this.el.style.top = `${top}px`;
      }

      onRemove() {
        this.el.parentNode?.removeChild(this.el);
      }
    }

    const overlay = new CreatorPreviewOverlay(
      new g.maps.LatLng(creator.latitude, creator.longitude),
      cardEl,
    );
    overlay.setMap(map);
    previewOverlayRef.current = overlay;

    // Fade in after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cardEl.isConnected) cardEl.style.opacity = "1";
      });
    });
  }, [
    selectedCreatorId,
    creators,
    shouldShowMobilePreview,
    isMobileUi,
    mobileSheetState,
    topInset,
    bottomInset,
  ]);

  // ── Zoom controls ──
  function updateZoom(delta: number) {
    const map = mapInstanceRef.current;
    if (!map) return;
    isProgrammaticMoveRef.current = true;
    map.setZoom(
      Math.max(9, Math.min(17, (map.getZoom() ?? DEFAULT_ZOOM) + delta)),
    );
  }

  function focusUserLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const map = mapInstanceRef.current;
      if (!map) return;
      isProgrammaticMoveRef.current = true;
      map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      map.setZoom(14);
    });
  }

  const handleSearchInArea = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setSearchLoading(true);

    const bounds = map.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      onSearchInArea({ n: ne.lat(), s: sw.lat(), e: ne.lng(), w: sw.lng() });
    }

    setShowSearchHere(false);
    setSearchLoading(false);
  }, [onSearchInArea]);

  const handleReturnToCompany = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    isProgrammaticMoveRef.current = true;
    map.panTo(companyLatLng);
    map.setZoom(DEFAULT_ZOOM);
    setShowSearchHere(false);
    onReturnToCompany();
  }, [companyLatLng, onReturnToCompany]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <div ref={mapRef} className="h-full w-full" />

      {/* Map error */}
      {mapError && (
        <div className="absolute inset-x-4 top-4 z-20 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">Google Maps indisponível</p>
          <p className="mt-1 text-xs">{mapError}</p>
        </div>
      )}

      {/* Creator count badge — top-left */}
      {!mapError && showCreatorCountBadge && (
        <div className="absolute left-4 z-10" style={{ top: topOffset }}>
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-500" />
            <span className="text-xs font-semibold text-slate-700">
              {creators.length} creators
            </span>
          </div>
        </div>
      )}

      {/* Zoom + geolocation controls — top-right */}
      <div className="absolute right-4 z-10 flex flex-col gap-2" style={{ top: topOffset }}>
        <button
          type="button"
          onClick={() => updateZoom(1)}
          className={isMobileUi ? mobileControlButtonClassName : "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-slate-50"}
          aria-label="Aproximar"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => updateZoom(-1)}
          className={isMobileUi ? mobileControlButtonClassName : "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-slate-50"}
          aria-label="Afastar"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={focusUserLocation}
          className={isMobileUi ? "flex h-10 w-10 items-center justify-center rounded-2xl bg-[#895af6] text-white shadow-[0_10px_24px_rgba(137,90,246,0.35)] hover:bg-[#7c4ee0]" : "flex h-9 w-9 items-center justify-center rounded-lg bg-[#895af6] text-white shadow-sm hover:bg-[#7c4ee0]"}
          aria-label="Minha localização"
        >
          <Locate size={15} />
        </button>
        {isMobileUi && (
          <button
            type="button"
            onClick={handleReturnToCompany}
            className={mobileControlButtonClassName}
            aria-label="Voltar para empresa"
          >
            <Building2 size={15} />
          </button>
        )}
      </div>

      {/* "Buscar nesta área" — bottom-center, appears after manual map move */}
      {showSearchHere && showSearchButton && (
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2"
          style={{ bottom: isMobileUi ? mobileFloatingBottom : 64 }}
        >
          <button
            type="button"
            onClick={handleSearchInArea}
            disabled={searchLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:opacity-70"
          >
            <MapPin size={15} className="text-purple-600" />
            {searchLoading ? "Buscando..." : "Buscar nesta área"}
          </button>
        </div>
      )}

      {/* "Voltar para empresa" — bottom-right, always visible */}
      {!isMobileUi && (
        <div className="absolute bottom-4 right-4 z-10">
        <button
          type="button"
          onClick={handleReturnToCompany}
          className="flex items-center gap-2 rounded-xl bg-[#895af6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#7c4ee0]"
        >
          <Building2 size={15} />
          Voltar para empresa
        </button>
        </div>
      )}
    </div>
  );
}
