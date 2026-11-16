export function isAnomalyArtifactStale(
  generatedAt: string | undefined,
  geradoEm: string | undefined,
): boolean {
  if (!generatedAt || !geradoEm) return false;
  const artifact = Date.parse(generatedAt);
  const manifest = Date.parse(geradoEm);
  if (Number.isNaN(artifact) || Number.isNaN(manifest)) return false;
  return artifact < manifest;
}
