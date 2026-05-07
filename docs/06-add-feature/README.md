# 6. Add a feature with Copilot CLI

So far you've built and shipped the template. Now let's **extend** it. You'll add a brand-new feature that touches both the data model and the UI: a **comments thread** on each work order, so service pros and the manager can communicate about a job over time.

The interesting part: you'll do this with the **GitHub Copilot CLI** as your software engineer. The **rayfin agent skill** teaches the agent how Rayfin entities, decorators, permissions, and the typed client work, so it can make changes that fit the project's conventions instead of guessing.

---

## 1. Install the rayfin agent skill

[**Agent skills**](https://agentskills.io/) are reusable bundles of instructions, conventions, and tooling that teach an AI coding agent how to work in a specific domain. The **rayfin agent skill** packages everything the Copilot CLI needs to know about Rayfin — entities, decorators, permissions, the typed client, the CLI workflow — so the agent generates code that fits Rayfin conventions instead of guessing. Under the hood, the skill talks to the **rayfin MCP server** (which ships in the template as the `@microsoft/rayfin-mcp` dev dependency), giving the agent live access to the official Rayfin docs while it works.

The rayfin agent skill is **not installed automatically** with the project: you need to install it once so the Copilot CLI loads it whenever you open a Rayfin project.

[TODO: document the exact install command for the rayfin agent skill, currently the `npx rayfin init ai-files install` command from the docs isn't working]

On top of the skill, the template ships with an [**`AGENTS.md`**](https://agents.md/) file at the project root. `AGENTS.md` is an emerging convention for project-level agent instructions — a single, predictable place where any AI coding agent looks for repo-specific guidance (architecture, key files, conventions). Open `AGENTS.md` and skim it: that's exactly the context the Copilot CLI will pick up when you start it in this project.

So once the skill is installed, the Copilot CLI has everything it needs: project-specific guidance from `AGENTS.md`, rayfin-wide best practices from the agent skill, and live Rayfin docs through the MCP server.

## 2. Open the Copilot CLI in your project

In Visual Studio Code, open a terminal at the **project root** and start the CLI:

```sh
copilot --yolo
```

When it asks whether to trust the workspace, choose **Always trust this workspace**.

> ⚡ **What does `--yolo` do?** It auto-approves every tool call (file edits, terminal commands, MCP calls) without asking for confirmation each time. Great for an interactive lab where you want the agent to just *do the thing*, much slower without it. **Don't use `--yolo` against a repo with secrets, production data, or anything you can't easily revert**.

Once you're at the Copilot prompt, switch to a stronger model for this step. Run:

```
/model
```

Pick **GPT-5.4** with **low** reasoning effort. GPT-5.4 handles the multi-file refactor well, and "low" keeps responses fast enough for a live lab.

> 💡 The `/model` selection persists for the duration of this Copilot CLI session. If you exit and re-enter, set it again.

## 3. Prompt for the comments feature

At the Copilot prompt, paste:

```
Add comments to the work orders, with a history of interventions, so that service pros and the manager can communicate and ask questions about a work order. Comments must have: id, userId, createdAt, workOrderId, content. Keep the comments section folded by default in the UI. Only the service pro assigned to the work order and the manager can see the comments and add new ones. Don't apply the schema change yet on the backend, just generate the code.
```

The agent will:

- Plan the change and show you the files it intends to add or modify.
- Add a new **`Comment`** entity in `rayfin/data/`, with `@uuid`, `@text({ max: ... })`, `@date` decorators, and a `@one(() => WorkOrder)` relationship.
- Register the new entity in `rayfin/data/schema.ts`.
- Apply a `@role` rule so only the assigned service pro and the manager can read/create comments — using the row-level filter pattern you saw in [Step 3](../03-explore-template/README.md).
- Update the React components for the work-order detail view to add a **collapsible "Comments" section**, fetch comments, and post new ones using the typed Rayfin data client.

## 4. Review what changed

Once the agent finishes, look through the changes in the Visual Studio Code Source Control view (or `git status` / `git diff`).

Expect to see at least:

- A new file under `rayfin/data/` (e.g., `Comment.ts`)
- An updated `rayfin/data/schema.ts` exporting the new entity
- New or updated components under `src/components/` and/or `src/pages/`
- A new service or hook for talking to the comments API (e.g., extensions to `RayfinFieldService.ts` or `useFieldService.ts`)

> 🧠 **What you didn't have to do:** write a migration, hand-roll an API endpoint, build a REST client, wire up authorization middleware. The decorators + the typed client + the Copilot skill cover all of that for you.

## 5. Apply the schema locally and try it

We asked the agent **not** to run any database changes, so the new `Comment` entity exists only in TypeScript at this point. To actually try the feature in the browser, you need to apply the schema to your local database.

In the terminal where you ran `rayfin dev`, apply the schema:

```sh
npx rayfin dev db apply
```

This compiles the decorators in `rayfin/data/` to a database migration and applies it to the local SQL database. You should see a confirmation that the new `Comment` table was created.

> 💡 If you'd rather use the project's npm script: `npm run rayfin:db` does the same thing.

Now switch back to the frontend tab in your browser. If the new UI doesn't show up, restart the Vite dev server, in a second terminal where `npm run dev` was running, stop it (`Ctrl+C`) and start it again:

```sh
npm run dev
```

In the browser:

- Sign in (as a service pro, then in another tab as the manager via `/manager/`).
- Open a work order that's assigned to you.
- Expand the new **Comments** section and post a couple of messages.
- Confirm the manager sees the same thread, and that an unrelated service pro does **not** (the `@role` filter the agent generated should hide them).

If anything is broken, head to the iterate step below.

## 6. (Optional) Iterate

If something looks off — wrong field name, missing validation, UI not folded by default or an error occurs, simply tell the agent. Examples:

```
This error appears in the UI, fix it: <paste error message or screenshot>
```

The agent applies refinements with the same project context, so you stay in flow without leaving the editor.

---

## ✅ Verify

- A new `Comment` entity exists in `rayfin/data/` and is exported from `schema.ts`.
- `npx rayfin dev db apply` succeeded and the local schema now includes the `Comment` table.
- The work-order UI has a **collapsible Comments section** (folded by default), and you can post comments end-to-end as a service pro and the manager.

You've added a real, schema-backed feature locally. Next, push it to production.

---

Prev ← [5. Deploy to production](../05-deploy/README.md) · Next → [7. Redeploy and seed test data](../07-redeploy-and-seed/README.md)

