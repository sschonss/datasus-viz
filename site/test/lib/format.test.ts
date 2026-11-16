import { describe, expect, it } from 'vitest';

import {
  formatCompetencia,
  formatCompetenciaRange,
  formatGeradoEm,
  formatGeradoEmDateTime,
} from '@/lib/format';

describe('formatCompetencia', () => {
  it('formata YYYY-MM para "Mmm. YYYY"', () => {
    expect(formatCompetencia('2024-01')).toBe('Jan. 2024');
    expect(formatCompetencia('2024-12')).toBe('Dez. 2024');
    expect(formatCompetencia('2008-07')).toBe('Jul. 2008');
  });

  it('retorna input original quando inválido', () => {
    expect(formatCompetencia('invalido')).toBe('invalido');
    expect(formatCompetencia('2024-13')).toBe('2024-13');
  });
});

describe('formatCompetenciaRange', () => {
  it('formata faixa com from e to distintos', () => {
    expect(formatCompetenciaRange({ from: '2024-01', to: '2024-12' })).toBe(
      'Jan. 2024 – Dez. 2024',
    );
  });

  it('colapsa quando from === to', () => {
    expect(formatCompetenciaRange({ from: '2024-03', to: '2024-03' })).toBe('Mar. 2024');
  });
});

describe('formatGeradoEm', () => {
  it('formata ISO como dd/mm/aaaa', () => {
    expect(formatGeradoEm('2026-10-01T16:49:14.258Z')).toBe('01/10/2026');
  });

  it('formata data inválida como travessão', () => {
    expect(formatGeradoEm('não é data')).toBe('—');
  });
});

describe('formatGeradoEmDateTime', () => {
  it('formata data e hora no locale pt-BR', () => {
    const iso = '2026-11-03T15:18:22.716Z';
    const expected = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(iso));
    expect(formatGeradoEmDateTime(iso)).toBe(expected);
  });

  it('devolve traço para valor inválido', () => {
    expect(formatGeradoEmDateTime('não é data')).toBe('—');
  });
});
