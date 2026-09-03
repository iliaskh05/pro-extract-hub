/** Projection lat/lon → coordonnées carte France (métropole). */
export const FRANCE_BOUNDS = {
  minLon: -5.142,
  maxLon: 9.56,
  minLat: 41.33,
  maxLat: 51.09,
} as const;

export type MapPoint = { x: number; y: number };

export function projectLatLon(
  lat: number,
  lon: number,
  width: number,
  height: number,
  pad = 20,
): MapPoint {
  const x =
    pad +
    ((lon - FRANCE_BOUNDS.minLon) / (FRANCE_BOUNDS.maxLon - FRANCE_BOUNDS.minLon)) *
      (width - pad * 2);
  const y =
    pad +
    ((FRANCE_BOUNDS.maxLat - lat) / (FRANCE_BOUNDS.maxLat - FRANCE_BOUNDS.minLat)) *
      (height - pad * 2);
  return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
}
