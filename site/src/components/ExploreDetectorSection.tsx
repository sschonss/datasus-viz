import { AnomalyDetectorTable } from '@/components/AnomalyDetectorTable';
import { AnomalyStaleWarning } from '@/components/AnomalyStaleWarning';
import type { AnomalyHit, AnomalyKind, PopulationLookup } from '@/lib/anomaly';
import type { AnomaliesPayload } from '@/lib/queries';

const DETECTOR_LABELS: Record<AnomalyKind, string> = {
  concentration: 'Concentração',
  'per-capita': 'Per capita',
  'price-ratio': 'Preço/exame',
  spike: 'Pico temporal',
};

const DETECTOR_AXIS_LABELS: Record<AnomalyKind, string> = {
  concentration: 'Concentração ÷ proporção populacional (×)',
  'per-capita': 'Exames por 1k habitantes',
  'price-ratio': 'BRL por exame',
  spike: 'Volume de exames no mês',
};

const NF_INT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const NF_MULT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const NF_BRL = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  maximumFractionDigits: 0,
  style: 'currency',
});

function formatValueForKind(kind: AnomalyKind): (v: number) => string {
  // O score da concentração deixou de ser share (0–1) e passou a ser o
  // quociente entre o share de volume e o share populacional — formatar
  // como percentual mostraria "1.224.100%" onde cabe "12.241×".
  if (kind === 'concentration') return (v: number) => `${NF_MULT.format(v)}×`;
  if (kind === 'price-ratio') return (v: number) => NF_BRL.format(v);
  return (v: number) => NF_INT.format(v);
}

export interface ExploreDetectorSectionProps {
  biomarkersByLoinc: Record<string, string>;
  detector: AnomalyKind;
  detectorError: string | undefined;
  geradoEm: string;
  hits: AnomalyHit[];
  loading: boolean;
  page: number;
  pageSize: number;
  payload: AnomaliesPayload | undefined;
  populationLookup: PopulationLookup | null;
  selectedHitKey: string | null;
  onHitSelect: (hit: AnomalyHit) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ExploreDetectorSection({
  biomarkersByLoinc,
  detector,
  detectorError,
  geradoEm,
  hits,
  loading,
  onHitSelect,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  payload,
  populationLookup,
  selectedHitKey,
}: ExploreDetectorSectionProps) {
  return (
    <section className="col-span-full mt-2">
      {!loading && payload ? (
        <AnomalyStaleWarning generatedAt={payload.generatedAt} geradoEm={geradoEm} />
      ) : null}

      {loading ? (
        <div className="text-muted-foreground flex h-[360px] items-center justify-center gap-3 font-sans text-sm">
          <div className="border-muted-foreground/30 border-t-primary size-5 animate-spin rounded-full border-2" />
          Carregando atipicidades…
        </div>
      ) : null}

      {detectorError !== undefined ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4 font-sans text-sm">
          <p className="font-medium">Não foi possível carregar este detector.</p>
          <p className="mt-1 text-xs">{detectorError}</p>
        </div>
      ) : null}

      {!loading && payload && hits.length === 0 ? (
        <div className="border-border bg-card flex h-[200px] items-center justify-center rounded-lg border p-6 text-center">
          <p className="text-muted-foreground font-sans text-sm">
            Nenhuma atipicidade encontrada com os filtros atuais. Tente outra UF, outro município,
            outro exame ou outro detector.
          </p>
        </div>
      ) : null}

      {!loading && hits.length > 0 && payload ? (
        <>
          <AnomalyDetectorTable
            axisLabel={DETECTOR_AXIS_LABELS[detector]}
            formatValue={formatValueForKind(detector)}
            hits={hits}
            kind={detector}
            labelForLoinc={(l) => biomarkersByLoinc[l] ?? l}
            onHitSelect={onHitSelect}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            page={page}
            pageSize={pageSize}
            populationLookup={populationLookup}
            selectedHitKey={selectedHitKey}
            title={DETECTOR_LABELS[detector]}
          />
          {payload.totalHitsBeforeCap > payload.topN ? (
            <p className="text-muted-foreground mt-2 font-sans text-[11px]">
              Mostrando os {payload.topN.toLocaleString('pt-BR')} hits de maior score (detector
              encontrou {payload.totalHitsBeforeCap.toLocaleString('pt-BR')} no total).
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
