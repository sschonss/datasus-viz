import { describe, expect, it } from 'vitest';

import { isAnomalyArtifactStale } from '@/lib/anomaly-freshness';

describe('isAnomalyArtifactStale', () => {
  it('é verdadeiro quando generatedAt é anterior a geradoEm, inclusive no mesmo dia', () => {
    expect(isAnomalyArtifactStale('2026-11-03T15:18:22.716Z', '2026-11-09T18:50:22.440Z')).toBe(
      true,
    );
    expect(isAnomalyArtifactStale('2026-11-09T18:40:00.000Z', '2026-11-09T18:50:22.440Z')).toBe(
      true,
    );
  });

  it('é falso quando o artefato é contemporâneo ou posterior ao manifest', () => {
    expect(isAnomalyArtifactStale('2026-11-09T18:50:22.440Z', '2026-11-09T18:50:22.440Z')).toBe(
      false,
    );
    expect(isAnomalyArtifactStale('2026-11-09T18:55:32.938Z', '2026-11-09T18:50:22.440Z')).toBe(
      false,
    );
  });

  it('é falso quando algum timestamp está ausente ou é inválido', () => {
    expect(isAnomalyArtifactStale(undefined, '2026-11-09T18:50:22.440Z')).toBe(false);
    expect(isAnomalyArtifactStale('2026-11-03T15:18:22.716Z', undefined)).toBe(false);
    expect(isAnomalyArtifactStale('não é data', '2026-11-09T18:50:22.440Z')).toBe(false);
    expect(isAnomalyArtifactStale('2026-11-03T15:18:22.716Z', 'também não')).toBe(false);
  });
});
