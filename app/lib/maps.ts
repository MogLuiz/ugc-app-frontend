/** Abre o Google Maps com busca pelo endereço ou texto informado. */
export function openMapsQuery(query: string): void {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
