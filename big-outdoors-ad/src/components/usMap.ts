import {geoAlbersUsa, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Feature, FeatureCollection, Geometry} from 'geojson';
// US Census-derived state boundaries (us-atlas, 1:10m)
import states10m from 'us-atlas/states-10m.json';

const topo = states10m as unknown as Parameters<typeof feature>[0] & {objects: Record<string, any>};

export const statesFC = feature(topo as any, topo.objects.states) as unknown as FeatureCollection<Geometry, {name: string}>;
export const nationFC = feature(topo as any, topo.objects.nation) as unknown as FeatureCollection<Geometry>;

export const MAP_W = 1920;
export const MAP_H = 1080;

export const projection = geoAlbersUsa().fitExtent(
  [
    [140, 110],
    [1780, 990],
  ],
  nationFC as any
);
export const pathGen = geoPath(projection);

export const statePaths = statesFC.features.map((f: Feature<Geometry, {name: string}>) => ({
  id: String(f.id),
  name: f.properties.name,
  d: pathGen(f as any) ?? '',
  centroid: pathGen.centroid(f as any),
}));

export const nationPath = pathGen(nationFC as any) ?? '';

// Real road route: Chicago → I-55 → St. Louis → I-44 → Tulsa → Oklahoma City → I-35 → Dallas.
const ROUTE_LONLAT: [number, number][] = [
  [-87.6298, 41.8781], // Chicago, IL
  [-88.0817, 41.525], // Joliet, IL (I-55)
  [-88.9937, 40.4842], // Bloomington, IL
  [-89.6501, 39.7817], // Springfield, IL
  [-90.1994, 38.627], // St. Louis, MO (I-44)
  [-91.7713, 37.9514], // Rolla, MO
  [-93.2923, 37.2089], // Springfield, MO
  [-94.5133, 37.0842], // Joplin, MO
  [-95.9928, 36.154], // Tulsa, OK
  [-97.5164, 35.4676], // Oklahoma City, OK (I-35)
  [-97.1436, 34.1743], // Ardmore, OK
  [-97.1331, 33.2148], // Denton, TX
  [-96.797, 32.7767], // Dallas, TX
];

export const routePts = ROUTE_LONLAT.map((ll) => projection(ll) as [number, number]);
export const CHICAGO = routePts[0];
export const DALLAS = routePts[routePts.length - 1];

const segLens = routePts.slice(1).map((p, i) => Math.hypot(p[0] - routePts[i][0], p[1] - routePts[i][1]));
export const routeLength = segLens.reduce((a, b) => a + b, 0);
export const routeD = routePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');

export const pointAt = (t: number): {x: number; y: number; angle: number} => {
  let dist = Math.max(0, Math.min(1, t)) * routeLength;
  for (let i = 0; i < segLens.length; i++) {
    if (dist <= segLens[i] || i === segLens.length - 1) {
      const a = routePts[i];
      const b = routePts[i + 1];
      const u = segLens[i] === 0 ? 0 : Math.min(1, dist / segLens[i]);
      return {
        x: a[0] + (b[0] - a[0]) * u,
        y: a[1] + (b[1] - a[1]) * u,
        angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI,
      };
    }
    dist -= segLens[i];
  }
  return {x: DALLAS[0], y: DALLAS[1], angle: 0};
};
