import { isAnomalyArtifactStale } from '@/lib/anomaly-freshness';
import { formatGeradoEmDateTime } from '@/lib/format';

export interface AnomalyStaleWarningProps {
  generatedAt: string | undefined;
  geradoEm: string | undefined;
}

/**
 * Aviso em `/explore` quando o JSON de atipicidades é anterior ao
 * manifest dos agregados (artefato committed no Pages, parquet no CDN).
 */
export function AnomalyStaleWarning({ generatedAt, geradoEm }: AnomalyStaleWarningProps) {
  if (!isAnomalyArtifactStale(generatedAt, geradoEm)) return null;
  return (
    <div
      className="col-span-full mb-3 rounded-lg border border-amber-500/40 bg-amber-50 p-4 font-sans text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
      role="status"
    >
      <p className="font-medium">Atipicidades defasadas em relação aos agregados.</p>
      <p className="mt-1 text-xs">
        Os detectores foram gerados em {formatGeradoEmDateTime(generatedAt ?? '')} — antes do
        manifest atual ({formatGeradoEmDateTime(geradoEm ?? '')}). Os números do mapa podem já
        incluir competências ou correções que ainda não entraram nesta lista.
      </p>
    </div>
  );
}
