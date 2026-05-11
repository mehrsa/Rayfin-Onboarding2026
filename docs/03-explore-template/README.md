
# Explore the template

Before running the app, take a few minutes to look at what **rayfin** scaffolded for you. The Field Services template is a real, working full-stack app: a React + TypeScript frontend, a Rayfin-managed backend, authentication, and a starter data model. Knowing where things live will make the rest of the lab much easier.

> [!TIP]
> You don't need to fully understand every file, this is a guided tour. Skim, then move on.

## 1. Project layout

In Visual Studio Code, expand the project in the Explorer. The folders that matter for this lab:

| Folder / file | What it is |@lab.Activity(DataModelQuestion)

| --- | --- |
| `rayfin/rayfin.yml` | Rayfin app configuration — declares which managed services are turned on (auth, data, hosting…) |
| `rayfin/data/` | Backend data model — one TypeScript file per entity, plus a `schema.ts` that exports them |
| `src/` | React + TypeScript frontend |
| `src/services/` | Service layer that talks to the Rayfin backend (auth + data clients) |
| `src/pages/` | Page components — `Dashboard.tsx` (Service Pro + manager views), `AuthPage.tsx`, hidden `AdminPage.tsx` |
| `src/components/ui/` | Reusable UI components (Radix-based, styled with Tailwind CSS) |
| `data/` | The original spec (`SPEC.md`) and seed dataset (`work-orders.jsonc`) used to generate this template — informational only |
| `package.json` | Scripts: `dev`, `rayfin:dev`, `rayfin:db`, `dev:fabric`, `build`, `test` |
| `AGENTS.md` | High-level project guide intended for AI coding agents — useful reference for humans too |

You can ignore everything else for now (Vite/TypeScript/Tailwind config, generated files, etc.).

## 2. Open **rayfin/rayfin.yml**

This is the heart of the Rayfin app. It tells the platform which managed services to provision and how they're wired together.

Open `rayfin/rayfin.yml` and look at it:

```yaml
id: field-services-app
name: Field Services
version: 1.0.0
services:
  auth:
    enabled: true
    password:
      enabled: true
    fabric:
      enabled: true
    allowedRedirectUris:
      - http://localhost:5173
      - http://localhost:5173/auth/callback
  data:
    enabled: true
    dialect: mssql
  storage:
    enabled: false
  staticHosting:
    enabled: true
    folder: dist
    buildCommand: npm run build:fabric
    indexDocument: index.html
```

Notice:

- **`auth`** — the managed authentication service is on. Two providers are enabled: **password** (used for local development) and **fabric** (Microsoft Entra SSO, used when deployed to Microsoft Fabric).
- **`data`** — a managed SQL database is provisioned automatically; you don't need to set up any infrastructure.
- **`storage`** — turned off for this template, but available if your app needs blob storage.
- **`staticHosting`** — when you deploy with `rayfin up`, the frontend is built (`npm run build:fabric`) and the contents of `dist/` are served by Fabric.

You only declare *what* you need; the platform handles *how* to provision and wire it up.

## 3. Look at the data model in **rayfin/data/**

Open the `rayfin/data/` folder. You'll see three files: a per-entity file for each table, plus a `schema.ts` that aggregates them.

### **schema.ts**

```ts
import { ServicePro } from './ServicePro.js';
import { WorkOrder } from './WorkOrder.js';

export type FieldServiceSchema = {
  ServicePro: ServicePro;
  WorkOrder: WorkOrder;
};

export const schema = [ServicePro, WorkOrder];
```

Every entity you want in the database needs to be both imported and added to the `schema` array. You'll update this file later when you'll add a new entity through the GitHub Copilot CLI.

### **ServicePro.ts**

```ts
@entity()
@role('authenticated', '*')
export class ServicePro {
  @uuid() id!: string;
  @text({ min: 1, max: 100 }) name!: string;
  @text({ min: 1, max: 300 }) skills!: string;
  @text() user_id!: string;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
}
```

Notice the **decorators** (all imported from `@microsoft/rayfin-core`):

- `@entity()` — registers this class as a Rayfin entity (a database table).
- `@role('authenticated', '*')` — **any signed-in user** can perform **any** action (`'*'` = create, read, update, delete). For real-world data you'd usually narrow this with a `check: (claims, item) => claims.sub.eq(item.user_id)` row-level filter <!-- TODO: link to the Rayfin permissions guide on Microsoft Learn once it's published -->. For this lab the broad rule is fine.
- `@uuid()`, `@text({ min, max })`, `@date()` — type-safe column definitions with built-in validation. On MSSQL, always set a `max` on `@text` so DAB can generate an indexable column.

> [!help]
> **Why is `user_id` a `@text()` and not a `@uuid()` or a relationship?**
> `user_id` doesn't reference another Rayfin entity — it stores the JWT `sub` claim from whichever auth provider is active (Rayfin password locally, Microsoft Entra in Fabric). Entra `sub` values are opaque strings, not Rayfin-shaped UUIDs, and the signed-in user isn't exposed as a queryable Rayfin entity. So the convention is: **auth-derived identity fields use `@text()`; foreign keys to other Rayfin entities use `@uuid()`**.

### **WorkOrder.ts**

```ts
@entity()
@role('authenticated', '*')
export class WorkOrder {
  @uuid() id!: string;
  @text({ min: 1, max: 120 }) customer!: string;
  @text({ min: 1, max: 240 }) address!: string;
  @text({ min: 1, max: 240 }) task!: string;
  @date() scheduledAt!: Date;
  @set('pending', 'assigned', 'in_progress', 'completed', 'needs_followup', 'cancelled')
  status!: WorkOrderStatus;
  @uuid({ optional: true }) servicePro_id?: string;
  @one(() => ServicePro, { optional: true }) servicePro?: ServicePro;
  @text({ optional: true, max: 500 }) note?: string;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
}
```

Two new things to note:

- `@set(...)` defines an enum-like column constrained to a fixed list of string values. It compiles to a string column with a database `CHECK` constraint, so invalid values are rejected at the database layer.
- `@one(() => ServicePro, { optional: true })` declares a relationship to another entity. Rayfin auto-generates the foreign key column when you use `@one()` or `@many()`; the explicit `servicePro_id?: string` field above is included here only because the application code wants to read/write that ID directly.

These TypeScript classes are the **single source of truth** for the database schema. When you change them, Rayfin regenerates the database migration for you (you'll see this in the next pages).

## 4. (Optional) Peek at the frontend service layer

If you're curious how the frontend talks to the backend, open `src/services/`. The interesting files:

- `ServiceContainer.ts` — singleton that bootstraps the Rayfin client and auto-selects the right auth provider (password locally, Fabric Entra in production).
- `rayfin/RayfinFieldService.ts` — CRUD operations for `ServicePro` and `WorkOrder` using the typed Rayfin data API.

You don't need to understand the full implementation. Just notice that:

- The frontend uses a **typed client** generated from the schema you just looked at — so renaming a field in `rayfin/data/` shows up as a TypeScript error in the UI code right away.
- There's no hand-written REST client, no manual API plumbing.

---

## ✅ Knowledge check

@lab.Activity(DataModelQuestion)

@lab.Activity(ManagedServicesQuestion)

If any of those don't ring a bell, scroll back up before moving on.

---

Continue with **Next →** to run the app locally.
