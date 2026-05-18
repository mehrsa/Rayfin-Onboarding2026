# Field Services

Rayfin app for field operations: managers create and assign work orders, Service Pros accept jobs and mark them complete.

## Profiles

- **Service Pros** use `/`, create a profile on first access, list skills such as `painting, plumbing, hanging`, accept matching jobs, and mark their own jobs done. Profile editing lives at `/profile`.
- **Manager** uses `/manager/` to create work orders, assign Service Pros, and track status.

## Data model

The Rayfin schema is based on `data/work-orders.jsonc`:

- `ServicePro`: name, comma-separated skills, auth user id, audit dates.
- `WorkOrder`: customer, address, task, scheduled date, status, optional assigned service pro, note, audit dates.

One unassigned example work order is seeded on first load when no work orders exist.

## Admin data tools

The hidden authenticated route `/_admin/` can replace DB contents with generated demo data or reset the DB to one unassigned example work order. The large seed lives in `src/data/field-service-seed.json`.

Regenerate and validate it with:

```bash
npm run seed:generate
npm run seed:validate
```

## Run

```bash
npm install
npm run rayfin:dev
npm run rayfin:db
npm run dev
```

Local auth uses Rayfin email/password accounts. Use the sign-up toggle on the sign-in page for first login.

For Fabric:

```bash
npx rayfin login
npx rayfin up
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite frontend |
| `npm run build` | Type-check and build |
| `npm test` | Run Vitest |
| `npm run seed:generate` | Generate large Field Services seed JSON |
| `npm run seed:validate` | Validate generated seed JSON |
| `npm run rayfin:dev` | Start local Rayfin backend |
| `npm run rayfin:db` | Apply Rayfin schema |
