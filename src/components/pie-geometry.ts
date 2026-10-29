/* Geometria das fatias Aerobubble: dois lados paralelos às fronteiras
   radiais e afastados pelo mesmo valor em toda a extensão. */
export function glassSlice(cx: number, cy: number, radius: number, start: number, end: number) {
  const sweep = end - start;
  if (!(radius > 0) || !(sweep > 0) || sweep >= Math.PI * 2) return { path: "", halfGap: 0 };
  const sine = Math.sin(sweep / 2);
  const halfGap = Math.min(2.5, radius * Math.max(sine, 0) * .2);
  const innerDistance = halfGap / Math.max(sine, 1e-9);
  const outerDistance = Math.sqrt(Math.max(0, radius * radius - halfGap * halfGap));
  const inner = { x: cx + Math.cos((start + end) / 2) * innerDistance, y: cy + Math.sin((start + end) / 2) * innerDistance };
  const startDir = { x: Math.cos(start), y: Math.sin(start) };
  const endDir = { x: Math.cos(end), y: Math.sin(end) };
  const startNormal = { x: -startDir.y, y: startDir.x };
  const endNormal = { x: -endDir.y, y: endDir.x };
  const point = (p: { x: number; y: number }) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
  const along = (dir: typeof startDir, normal: typeof startNormal, distance: number, offset: number) => ({ x: cx + dir.x * distance + normal.x * offset, y: cy + dir.y * distance + normal.y * offset });
  const radial = (angle: number) => ({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  const arcStart = start + Math.asin(halfGap / radius);
  const arcEnd = end - Math.asin(halfGap / radius);
  const corner = Math.max(0, Math.min(5, (outerDistance - innerDistance) / 4, radius * Math.max(arcEnd - arcStart, 0) / 4));
  const delta = corner / radius;
  const innerStart = { x: inner.x + startDir.x * corner, y: inner.y + startDir.y * corner };
  const innerEnd = { x: inner.x + endDir.x * corner, y: inner.y + endDir.y * corner };
  const path = `M${point(innerStart)} L${point(along(startDir, startNormal, outerDistance - corner, halfGap))} Q${point(along(startDir, startNormal, outerDistance, halfGap))} ${point(radial(arcStart + delta))} A${radius},${radius} 0 ${arcEnd - arcStart - 2 * delta > Math.PI ? 1 : 0} 1 ${point(radial(arcEnd - delta))} Q${point(along(endDir, endNormal, outerDistance, -halfGap))} ${point(along(endDir, endNormal, outerDistance - corner, -halfGap))} L${point(innerEnd)} Q${point(inner)} ${point(innerStart)} Z`;
  return { path, halfGap };
}
