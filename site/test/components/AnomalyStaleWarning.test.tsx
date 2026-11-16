import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AnomalyStaleWarning } from '@/components/AnomalyStaleWarning';
import { formatGeradoEmDateTime } from '@/lib/format';

const ARTIFACT = '2026-11-03T15:18:22.716Z';
const MANIFEST = '2026-11-09T18:50:22.440Z';

describe('AnomalyStaleWarning', () => {
  it('avisa quando o artefato é anterior ao manifest e mostra os dois instantes', () => {
    render(<AnomalyStaleWarning generatedAt={ARTIFACT} geradoEm={MANIFEST} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Atipicidades defasadas em relação aos agregados.');
    expect(status).toHaveTextContent(formatGeradoEmDateTime(ARTIFACT));
    expect(status).toHaveTextContent(formatGeradoEmDateTime(MANIFEST));
  });

  it('não renderiza quando o artefato é posterior ao manifest (caso do PR #94 após o merge)', () => {
    const { container } = render(
      <AnomalyStaleWarning generatedAt="2026-11-09T18:55:32.938Z" geradoEm={MANIFEST} />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('não renderiza quando os instantes são iguais ou inválidos', () => {
    const { rerender, container } = render(
      <AnomalyStaleWarning generatedAt={MANIFEST} geradoEm={MANIFEST} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<AnomalyStaleWarning generatedAt={undefined} geradoEm={MANIFEST} />);
    expect(container).toBeEmptyDOMElement();
  });
});
