# Convenções

## Idioma

- **Documentação, README, commits, comentários voltados ao usuário**: pt-BR com acentuação correta
- **Identificadores técnicos** (nomes de funções, tipos, variáveis, pacotes): inglês técnico
- Arquivos padrão (`LICENSE`, `CODE_OF_CONDUCT.md`) mantêm o formato upstream

## TypeScript

- **Strict mode** com `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- **ESM + CJS dual output** via tsup
- Evitar `any`; usar `unknown` + narrow quando necessário
- Preferir `type-only imports` (`import type { Foo }`)
- Funções públicas: documentar com JSDoc breve explicando _o quê_ e (quando não óbvio) _por quê_

## Saída de dados — JSON-first

- APIs retornam **objetos JS tipados** (arrays ou async iterables)
- Serialização default: **JSON** (single-shot) ou **JSONL** (streaming / datasets grandes)
- CSV **não é default** — disponível apenas como opção explícita (`--format csv`)
- Parquet/Arrow são formatos de **armazenamento/cache** opcionais, não saída primária
- Todo exemplo, script de verificação, snippet de README e output de CLI sai em JSON por padrão

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/)
- Em **pt-BR** na descrição; tipo (`feat`, `fix`, etc.) em inglês
- Escopos válidos: `site`, `cli`, `docs`, `ci`, `deps`, `lint`, `config` (iguais ao `.commitlintrc.cjs` e ao `AGENTS.md`)
- Não incluir linhas de atribuição de IA

Exemplos:

- `feat(site): versionar URLs de parquet-opt no manifest`
- `fix(cli): corrigir encoding da saída JSON`
- `test(site): adicionar fixtures para testes de regressão`
- `docs: atualizar README com exemplo de uso`

## Testes

- **Vitest** com limiar de cobertura ≥ 80%
- Golden files / fixtures de referência em JSON
- Nunca diminuir limiares de cobertura — adicionar testes para elevar

## Estrutura e pacotes

A estrutura atual (ver `AGENTS.md`) é:

```
packages/
  cli/     → `@precisa-saude/datasus-cli`  (CLI `datasus-viz`, consome `@precisa-saude/datasus-sdk` via npm)
site/      → `@datasus-viz/site`           (Vite + React + MapLibre + DuckDB WASM)
```

Os pacotes `@precisa-saude/datasus-dbc` e `@precisa-saude/datasus` / `@precisa-saude/datasus-sdk` **não vivem neste repositório**; o CLI e o site os consomem como dependência npm.

## Dependências

**Perguntar antes de adicionar** dependências runtime novas. Justificar por quê e qual alternativa foi considerada.

Regras por pacote:

- `@precisa-saude/datasus-cli`: `@precisa-saude/datasus-sdk` como dep runtime (publicado no npm; não editar o SDK aqui)
- `@datasus-viz/site`: ver `site/package.json`; o SDK entra em build-time (catálogo SIGTAP), não como runtime pesado no browser

## Git

- Sempre criar PR, nunca push direto em `main`
- Nunca usar `--no-verify`, `--no-gpg-sign` ou flags que pulem hooks
- `git pull --rebase origin main` para manter histórico linear
- Commits assinados com GPG (`commit.gpgsign=true`)

## Fontes Proibidas

Ao documentar schemas ou labeling:

**Proibidas**:

- Blogs comerciais ou portais não-acadêmicos
- Páginas iniciais genéricas (use URLs de documentos específicos)

**Aceitáveis** (nesta ordem):

1. Documentação oficial DATASUS/Ministério da Saúde
2. Tabelas IBGE e portarias publicadas no DOU
3. Artigos PubMed/SciELO com DOI ou PMID
4. Publicações técnicas de sociedades médicas com referência verificável
