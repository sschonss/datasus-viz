/**
 * Compara o timestamp do artefato de atipicidades (`generatedAt`) com
 * o `geradoEm` do manifest dos agregados. Instantes ISO completos —
 * não só a data civil — para um regen minutos depois do manifest não
 * disparar aviso, e um artefato mais velho no mesmo dia disparar.
 *
 * Timestamps inválidos ou ausentes não disparam o aviso (evita falso
 * positivo se um dos lados ainda não carregou ou veio corrompido).
 */
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
