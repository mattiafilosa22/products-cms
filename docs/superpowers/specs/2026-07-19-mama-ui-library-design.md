# Spec — products-cms v2.0: app full-stack Next.js + UI library "mama"

**Data:** 2026-07-19
**Scopo:** portare il progetto alla versione 2.0: un'unica applicazione full-stack **Next.js**
(il backend Express viene assorbito e poi eliminato) e la UI library condivisa **mama**
estratta come package versionato e distribuito via npm workspaces, con i punti deboli
attuali sistemati (tipizzazione, accessibilità, test, documentazione).

## Contesto (stato attuale)

Il repo contiene due app separate orchestrate da Docker Compose:

- `frontend/` — Next.js 15 (App Router) + React 19 + TypeScript. Contiene la UI library
  informale in `frontend/src/app/_shared/`:
  - **Sistema form**: `Form` (wrapper su React Hook Form), `FormField` (Controller che
    inietta props negli input via `cloneElement`), input intercambiabili (`input-text`,
    `input-price`, `textarea`, `input-file`) accomunati dal contratto `InputConfig`.
  - **Table**: wrapper generico headless su TanStack Table v8 (colonne `ColumnDef<TData>`,
    azioni, paginazione server-side via `onStateChange`).
  - **Modal**: compound component con context (`ModalProvider`, `useModalContext`, `tryClose`).
- `backend/` — Express 4 + Prisma 5 (PostgreSQL) + Zod. Feature `products`
  (controller → service → Prisma), import/export CSV (multer + csv-parser), middleware auth JWT.
- `postman/` — collection per l'API REST.

### Punti deboli da sistemare

1. `FormField` usa `cloneElement` con cast `as InputConfig`: contratto verificato a runtime,
   non a compile time. `InputConfig` usa `any` per `value`/`onChange`/`onBlur`.
2. Il check `isEmpty` in `FormField` tratta lo `0` numerico come "vuoto": un campo readonly
   con valore 0 sparisce.
3. Il Modal non gestisce accessibilità: niente focus trap, `aria-modal`, chiusura con Esc.
4. Nessun test automatico e nessuna documentazione dei componenti.
5. La libreria è una cartella, non un package: nessun versioning né distribuzione.
6. Due app separate dove ne basta una: il backend Express duplica un layer HTTP che
   Next.js può fornire (Route Handlers), con doppio deploy e doppia manutenzione.

## Architettura target (v2.0)

```text
products-cms/
├─ apps/
│  └─ web/            # app Next.js full-stack (ex frontend/ + logica ex backend/)
│     ├─ prisma/      # schema, migrations, seed (migrati da backend/)
│     └─ src/app/api/ # Route Handlers REST (stessi contratti dell'API Express)
├─ packages/
│  └─ mama/           # UI library: package versionato (tsup, exports map, peerDeps)
├─ docker-compose.yml # solo PostgreSQL per lo sviluppo
└─ package.json       # npm workspaces
```

## Decisioni prese

| Decisione | Scelta |
|---|---|
| API layer | **Route Handlers REST** in `apps/web/src/app/api/` con gli stessi contratti dell'attuale API Express (la collection Postman resta valida). Niente Server Actions. |
| Struttura repo | npm workspaces: `apps/web` + `packages/mama`. `backend/` e `frontend/` spariscono a fine migrazione. |
| Nome libreria | **mama** (nome package definitivo deciso nel plan del Pezzo 1) |
| Build libreria | tsup (ESM + dichiarazioni di tipo), `exports` map, `react`/`react-dom` come peerDependencies. Nessuna pubblicazione su registry esterno. |
| A11y Modal | elemento `<dialog>` nativo (no dipendenze, focus/Esc/inert dalla piattaforma) |
| Test | Vitest + React Testing Library nel package mama; Vitest per la logica applicativa in `apps/web` dove previsto dai plan |
| Docs componenti | Storybook, dentro il package |
| Data fetching | TanStack Query in `apps/web` (NON dentro mama: la libreria resta agnostica sui dati). Axios resta come client HTTP. |
| Persistenza | Prisma + PostgreSQL migrano dentro `apps/web`; validazione input con Zod ai confini (Route Handlers) |
| Versioning | semver + CHANGELOG + tag git (strumento deciso nel plan del Pezzo 7) |
| Tooling | ESLint + Prettier con config condivisa alla radice del monorepo |
| CI | GitHub Actions su ogni push: type check, lint, format check, test. Pipeline rossa = pezzo non chiuso. |
| Processo | Plan per pezzo → approvazione utente → implementer → reviewer (10/10) → approvazione finale utente. **Commit e push sempre a carico dell'utente.** |

## Principi vincolanti (valgono per ogni pezzo)

- **Tipi**: TypeScript `strict`; vietato `any` (ESLint `@typescript-eslint/no-explicit-any`
  in error); preferire generics e discriminated unions; API pubbliche esplicitamente tipizzate;
  niente cast `as` ingiustificati.
- **SOLID applicato al contesto**: componenti e moduli a responsabilità singola; contratti al
  posto di accoppiamenti concreti; estensione via composizione; mama non dipende mai
  dall'applicazione (dipendenza a senso unico).
- **Confini validati**: ogni input esterno (body HTTP, file CSV) passa da uno schema Zod
  prima di toccare la logica; errori strutturati con status coerenti.
- **Test essenziali, non esaustivi**: si coprono il comportamento pubblico e gli edge case
  previsti dal plan del pezzo; niente rincorsa alla coverage né test su dettagli interni.
- **Best practices**: codice semplice e leggibile; comportamento pubblico coperto da test;
  breaking changes documentati; nessuna dipendenza aggiunta senza motivazione nel plan.

## Roadmap (8 pezzi, in ordine)

### Pezzo 1 — Monorepo: workspaces + estrazione del package

npm workspaces alla radice; `frontend/` diventa `apps/web`; il codice di `_shared/` diventa
`packages/mama` con `package.json`, exports map, peerDependencies e build tsup; `apps/web`
importa `mama` come dipendenza workspace. Tooling condiviso alla radice: **ESLint**
(con `no-explicit-any` in error) e **Prettier**, con gli script di gate (`lint`,
`format:check`). **Fine pezzo: l'app funziona identica a prima** (il backend Express resta
temporaneamente attivo).

### Pezzo 2 — Rete di sicurezza: test su mama

Vitest + Testing Library nel package. Test **essenziali** che descrivono il comportamento
ATTUALE di FormField (iniezione props, messaggi d'errore, required, readonly), Modal
(apertura/chiusura, config bottoni via context) e Table (rendering colonne, azioni,
paginazione). Scritti prima dei refactor per proteggerli. Nello stesso pezzo si aggiunge la
**CI GitHub Actions**: type check + lint + format check + test su ogni push.

### Pezzo 3 — FormField: da `cloneElement` a render prop tipizzato

Nuova API `render={(field) => <InputText {...field} />}` verificata dal compilatore.
`InputConfig` generico sul tipo del valore, senza `any`. Fix dell'edge case `isEmpty`/zero.
I test del Pezzo 2 vengono adattati alla nuova API mantenendo gli stessi comportamenti;
l'app viene migrata. (Breaking change: documentato nel Pezzo 7.)

### Pezzo 4 — Modal accessibile su `<dialog>`

Il guscio del Modal passa a `<dialog>` nativo (focus trap, Esc, inert dal browser;
`aria-labelledby` sul titolo; scroll lock). L'API compound (context, `tryClose`,
`ModalResult`) resta invariata. Test a11y di base.

### Pezzo 5 — Backend dentro Next: Route Handlers + Prisma

La logica di `backend/` migra in `apps/web`: schema/migrations/seed Prisma, schemi Zod,
service prodotti, import/export CSV e auth (middleware Next / verifica nei handler).
Route Handlers con gli **stessi contratti REST** (verificati con la collection Postman).
A fine pezzo: `backend/` eliminato, `docker-compose.yml` ridotto al solo PostgreSQL.

### Pezzo 6 — TanStack Query in apps/web

Refactor del data layer delle pagine prodotti: `useQuery` per liste/dettaglio (query key con
lo stato di paginazione della Table), `useMutation` + invalidation per create/update/delete
e import CSV, puntando alle nuove Route Handlers. mama non viene toccata.

### Pezzo 7 — Versioning e release della libreria

Semver + CHANGELOG + tag git (strumento — changesets vs `npm version` manuale — deciso nel
plan). La nuova API del FormField (Pezzo 3) viene trattata come breaking change: major bump
con nota di migrazione. Da qui in poi ogni modifica a mama passa dal flusso di release.

### Pezzo 8 — Storybook

Storybook nel package mama: stories per Form/FormField (con i vari input), Modal e Table
come documentazione vivente dei componenti.

## Fuori scope

- Pubblicazione su registry npm pubblico o privato.
- Nuovi componenti o nuove feature di prodotto non già presenti.
- Deploy (la CI si ferma ai check di qualità: niente pipeline di rilascio).
- Modifiche allo schema dati (la migrazione Prisma è a schema invariato).

## Criteri di successo

1. Repo a workspaces: `apps/web` + `packages/mama`; `frontend/` e `backend/` non esistono più.
2. L'app funziona come prima per l'utente finale; la collection Postman passa contro le
   Route Handlers.
3. Zero `any` nel monorepo; build tsup pulita con dichiarazioni di tipo.
4. Comportamenti pubblici di Form/FormField, Modal e Table coperti da test verdi.
5. Modal navigabile da tastiera (tab intrappolato, Esc chiude) con aria corretti.
6. Ogni input esterno validato con Zod nei Route Handlers.
7. Pagine prodotti su TanStack Query con cache e invalidation funzionanti.
8. mama ha versione, CHANGELOG con la major del FormField documentata e tag git.
9. Storybook avviabile con stories per i componenti principali.
10. CI GitHub Actions verde su ogni push: type check, lint, format check, test.
