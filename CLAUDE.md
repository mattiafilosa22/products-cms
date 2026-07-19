# CLAUDE.md — products-cms v2.0

## Overview

Backoffice e-commerce in evoluzione verso la **v2.0**: un'unica applicazione full-stack
**Next.js** (`apps/web`, che assorbe l'attuale backend Express) e la UI library condivisa
**mama** (`packages/mama`) come package versionato e distribuito via npm workspaces.
Priorità: codice semplice e leggibile, tipi rigorosi, comportamento coperto da test.

> **Spec normativa**: `docs/superpowers/specs/2026-07-19-mama-ui-library-design.md`
> (contesto, decisioni, roadmap in 8 pezzi, criteri di successo). Leggerla prima di ogni plan.
> **Stato attuale**: Pezzo 1 completato. Monorepo npm workspaces attivo: app in `apps/web`,
> UI library in `packages/mama` (build tsup con `.d.ts`); tooling radice ESLint + Prettier
> operativo. Il backend Express è ancora in `backend/` (migra col Pezzo 5).
> Prossimo: Pezzo 2 (test su mama + CI). Aggiornare questa nota man mano che i pezzi si chiudono.

## Stack & vincoli (non negoziabili)

- **App** (`apps/web`, target): Next.js 15 (App Router) + React 19 + TypeScript 5 `strict`;
  **Route Handlers REST** in `src/app/api/` con gli stessi contratti dell'API Express attuale
  (la collection Postman resta valida — niente Server Actions); Prisma 5 + PostgreSQL
  (Docker, solo db); validazione input con Zod ai confini; styling SCSS modules.
- **Form**: React Hook Form 7. **Tabelle**: TanStack Table v8 (headless).
- **Data fetching**: TanStack Query in `apps/web` (Pezzo 6); axios come client HTTP.
- **Libreria mama** (`packages/mama`, target): npm workspaces, build **tsup** (ESM + `.d.ts`),
  `exports` map, `react`/`react-dom` come **peerDependencies**; versioning semver con
  CHANGELOG e tag git. Nessuna pubblicazione su registry esterno.
- **Tooling**: **ESLint + Prettier** con config condivisa alla radice del monorepo;
  **CI GitHub Actions** con type check, lint, format check e test su ogni push.
- **Test**: Vitest + React Testing Library. **Docs componenti**: Storybook.
- **A11y Modal**: elemento `<dialog>` nativo — niente dipendenze a11y esterne.
- Nessuna dipendenza nuova senza motivazione scritta nel plan.

## Architettura (decisa — non re-inventare)

- **mama = componenti strutturali headless-oriented**: la libreria fornisce struttura e
  comportamento, l'app fornisce dati e contesto applicativo. mama **non importa mai**
  dall'applicazione (dipendenza a senso unico) e non contiene data fetching.
- Pattern in uso da preservare: **compound components + context** (Modal, Table),
  **generics sui dati** (`Table<TData>`, `Form<T extends FieldValues>`),
  **contratti espliciti** tra componenti (es. `InputConfig`).
- Refactor chiave (Pezzo 3): `FormField` passa da `cloneElement` a **render prop tipizzato**
  (`render={(field) => <InputText {...field} />}`): il contratto lo verifica il compilatore.
- **Lato server**: Route Handler sottile → schema Zod al confine → service (logica) → Prisma.
  Nessuna business logic nei handler; errori strutturati con status coerenti.
- I breaking change alle API pubbliche di mama sono ammessi ma vanno trattati come tali:
  major bump + nota di migrazione nel CHANGELOG (dal Pezzo 7 in poi, sempre via flusso di release).

## Convenzioni di codice

### Tipi (vincolo forte)

- `strict: true`; **vietato `any`** (`@typescript-eslint/no-explicit-any` in error).
  Se un tipo non è esprimibile, si usa `unknown` + narrowing, mai `any`.
- API pubbliche del package **esplicitamente tipizzate** (niente tipi inferiti esportati a caso).
- Preferire **generics** e **discriminated unions**; niente cast `as` per zittire il compilatore
  (un `as` va giustificato con un commento sul perché è sicuro).

### Stile

- Guard clause / early return; componenti e funzioni corti, a responsabilità singola.
- Niente magic string/number: costanti nominate o union types.
- Commenti brevi e solo sul _perché_; il codice dice il _cosa_.
- Un componente = una cartella (`component.tsx` + `component.module.scss` + eventuale `index.ts`),
  come già in uso nel repo.
- SOLID applicato al contesto: responsabilità singola per componente/modulo; estensione via
  composizione (children, render prop), non via flag booleani accumulati; l'app dipende dai
  contratti di mama, mai dai suoi interni.

## Testing

- **Component test** (RTL) su mama: comportamento pubblico, non implementazione — cosa vede/fa
  l'utente (label, errori, focus, Esc, click), niente test su stato interno o markup fragile.
- I test del Pezzo 2 fotografano il comportamento ATTUALE e proteggono i refactor successivi:
  nei pezzi 3-4 si adattano alla nuova API mantenendo gli stessi comportamenti.
- **Lato server**: la migrazione a Route Handlers (Pezzo 5) è verificata con la collection
  Postman (stessi contratti) più i test previsti dal plan del pezzo.
- **Test essenziali, non esaustivi**: si coprono il comportamento pubblico e gli edge case
  previsti dal plan del pezzo; niente rincorsa alla coverage né test su dettagli interni.
- I test sono **parte del "done"** di ogni pezzo: nessun pezzo chiuso con test rossi o assenti.

## Qualità & comandi di gate

Ogni pezzo è "done" solo con questi comandi verdi (dai workspace toccati):

```sh
npx tsc --noEmit      # type check
npm run lint          # eslint (include no-explicit-any)
npm run format:check  # prettier --check
npm run test          # vitest (dal Pezzo 2)
npm run build         # tsup / next build, dove il pezzo tocca la build
```

La CI (GitHub Actions) esegue gli stessi gate su ogni push: la pipeline rossa blocca il pezzo.

Script di radice disponibili (Pezzo 1):

```sh
npm run dev:web               # dev server Next.js (workspace web)
npm run typecheck             # tsc --noEmit su tutti i workspace
npm run lint                  # eslint sull'intero monorepo
npm run format                # prettier --write
npm run format:check          # prettier --check
npm run build --workspace mama  # build tsup della libreria
```

## Workflow — Human in the loop

- **Sessione principale = tech lead/orchestratore**: legge spec e CLAUDE.md, propone il plan del
  pezzo, coordina, non scrive codice di produzione.
- Si lavora **un pezzo alla volta**, nell'ordine della roadmap (8 pezzi). Niente lavoro anticipato.
- **Gate umano**: ogni pezzo parte da un plan approvato dall'utente PRIMA di scrivere codice.
- **Ciclo di qualità**: `implementer` realizza il pezzo → `reviewer` valuta con rubrica /10.
  Finché non è **10/10**, torna all'implementer con note. A 10/10 si chiede l'approvazione
  finale all'utente.
- **Commit e push: SEMPRE e solo l'utente.** Nessun agente committa, mai.
- Se hai dubbi o domande, chiedi.
