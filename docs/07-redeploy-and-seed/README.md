# Redeploy and seed test data

Your new comments feature works locally. Time to push it to production and put it under realistic load by seeding the deployed app with a large generated dataset. This sets us up for the next part, where we'll point Fabric data agents at the production data.

## 1. Redeploy with **rayfin up**

From the project folder, in a terminal, run:

```sh
npx rayfin up
```

This re-runs the same flow you saw in Step 5, but the CLI **detects your existing deployment** and updates it in place rather than provisioning a new one. It also picks up the schema change you just made and applies it to the production database automatically.

Watch the output. You should see steps for:

- Syncing `rayfin.yml` settings.
- **Applying the database schema** — this is where the new **Comment** table is created in production.
- Building and uploading the new frontend (the collapsible Comments UI).

When it finishes, the CLI prints the same hosting URL as before.

> [!alert]
> If `rayfin up` warns about destructive changes, review the listed operations carefully before re-running with `--force`. Adding a new entity or new optional fields should not trigger this warning, but dropping or renaming columns will.

## 2. Verify the new feature in production

Open the hosting URL in a browser tab where you're signed in to Microsoft Fabric.

- Sign in (Fabric SSO).
- Go through the same flow you tested locally: open a work order, expand the **Comments** section, post a comment.
- Open `/manager/` in another tab and confirm the manager sees the same comments.

If everything works, you've shipped a real schema-backed feature to production with a single command. 🎉

## 3. Seed the production database

The template ships with a hidden authenticated admin page at `/_admin/` that can:

- **Seed** the database with a large generated dataset of service pros and work orders (drawn from `src/data/field-service-seed.json`).
- **Reset** the database back to a single example work order.

It's not linked from the regular UI on purpose, go there directly by adding `/_admin/` to the deployed URL.

In the admin page:

1. Click **Seed database** (or the equivalent button).
2. Wait for the operation to complete. You'll see a confirmation with how many service pros and work orders were created.

Now go back to the Service Pro view and to the manager view at **/manager/**. You should see a much richer dataset: dozens of service pros across different skill sets, work orders in every status, addresses across multiple cities, etc.

> [!NOTE]
> **Why we're doing this:** in the next part we'll create a Fabric data agent over this app's database. A handful of seeded rows would make for boring queries, a few hundred makes the agent's natural-language answers more interesting.

## 4. (Optional) Add some comments

Pick a few work orders and post a couple of comments on each. The data agent in the next part can answer questions about comments too, and a sparse comments thread limits what you can ask.

---

## ✅ Verify

- `rayfin up` finished without errors and deployed the schema change + the new frontend.
- The production app shows a working **Comments** section on each work order.
- You ran the seed in the admin page and the deployed app now has dozens of service pros and work orders.

You now have a fully featured app and a production dataset to query.
