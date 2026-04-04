let mapsApiPromise: Promise<any> | null = null;

export function loadGoogleMapsApi(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps so pode ser carregado no navegador."));
  }

  const googleMaps = (window as any).google;
  if (googleMaps?.maps) {
    return Promise.resolve(googleMaps);
  }

  if (mapsApiPromise) {
    return mapsApiPromise;
  }

  mapsApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const loadedGoogleMaps = (window as any).google;
      if (loadedGoogleMaps?.maps) {
        resolve(loadedGoogleMaps);
      } else {
        reject(new Error("Google Maps nao foi inicializado corretamente."));
      }
    };

    script.onerror = () => reject(new Error("Falha ao carregar o script do Google Maps."));
    document.head.appendChild(script);
  });

  return mapsApiPromise;
}
