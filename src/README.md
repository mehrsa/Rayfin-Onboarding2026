# Source code

This folder contains the final version of the demo application used in the lab:

- [`field-services-app/`](./field-services-app/) - a React + TypeScript work-order management app backed by Project Rayfin.

The app demonstrates how to build a full-stack Field Services experience with Service Pro profiles, work-order assignment, local Rayfin email/password authentication, and Fabric Entra authentication for deployed Microsoft Fabric environments.

## Quickstart

From [`field-services-app/`](./field-services-app/):

```bash
npm install
npx rayfin up
npm run dev:fabric
```

## What is included

| Path | Description |
| --- | --- |
| [`field-services-app/src/`](./field-services-app/src/) | React user interface, pages, hooks, and services |
| [`field-services-app/rayfin/data/`](./field-services-app/rayfin/data/) | Rayfin data entities for Service Pros and work orders |
| [`field-services-app/rayfin/rayfin.yml`](./field-services-app/rayfin/rayfin.yml) | Rayfin configuration for auth, data, and deployment |
| [`field-services-app/src/data/field-service-seed.json`](./field-services-app/src/data/field-service-seed.json) | Generated demo seed data for the hidden admin tools page |

See the [Field Services app README](./field-services-app/README.md) for the full architecture notes, commands, scripts, and data model details.
