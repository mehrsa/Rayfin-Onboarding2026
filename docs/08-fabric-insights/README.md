# Explore data with Fabric intelligence

Your app is live in Microsoft Fabric, with a real production database backing it. Now let's flip perspectives: instead of using the database to **power** the app, let's **interrogate** it with natural language using **Microsoft Fabric data agents**.

By the end of this step, the manager could ask "How many work orders are scheduled for next week?" or "Who's our most productive Service Pro?" and get answers in plain English, without writing a line of SQL.


The Fabric App deployment exposes a SQL Database in your Fabric workspace. We'll build a **Power BI semantic model** over it, publish it to Fabric, then create a **Fabric data agent** that uses the semantic model as a data source. Finally, we'll ask the agent questions: first from the Fabric portal, then optionally from a Python notebook.

## 1. Open the SQL Database from the Rayfin deployment

When you ran `npx rayfin up`, Fabric provisioned a SQL Database in your workspace alongside your app item.

1. Open [https://app.fabric.microsoft.com](https://app.fabric.microsoft.com) and navigate to the workspace you created.
2. Locate the **SQL Database** item that belongs to your Rayfin deployment (its name starts with the same prefix as your Fabric data app item).
3. Click into it. From the database overview page, copy the **SQL connection string** — you'll need it in Power BI Desktop in the next section.

> [TODO: confirm exact item name pattern + screenshot of where to copy the SQL connection string from a Rayfin-deployed Fabric SQL Database.]

## 2. Build a Power BI semantic model over the database

A **semantic model** is the layer that gives the data agent a clean, well-described view of your data — table relationships, friendly names, descriptions — so it can translate natural language into accurate queries.

You'll build it in **Power BI Desktop**.

1. Launch **Power BI Desktop** from the Start menu.
2. Click **Get data** → **More…** → **Azure** → **Azure SQL Database** (or use the **Fabric** connector if available — both work for a Fabric-hosted SQL Database).
3. Paste the **server** and **database** names from the connection string you copied in Section 1.
4. Choose **DirectQuery** (or **Import** if you prefer a snapshot — DirectQuery keeps the model live against the production database).
5. When prompted for credentials, sign in with the same Microsoft account you've been using for Fabric (Microsoft Entra account / Microsoft account).
6. In the **Navigator**, select the tables you want to expose: at minimum **ServicePro**, **WorkOrder**, and **Comment**. Click **Load**.

Once loaded:

7. Open the **Model view** (the diagram icon on the left). Verify Power BI detected the relationship between **WorkOrder** and **ServicePro** via `servicePro_id`. If not, drag the FK column onto the matching `id` to create it.
8. Optional but recommended: rename columns to friendly names (e.g., `scheduledAt` → `Scheduled date`), add **descriptions** on tables and columns, and make sure date columns are typed as `Date` so the agent can answer time-based questions.

> [!TIP]
> **Why descriptive names matter:** the data agent uses table/column names and descriptions to interpret natural-language questions. `Scheduled date` is much more useful than `scheduledAt`. Spend a couple of minutes here, it pays back tenfold in agent answer quality.

> [TODO: add screenshots of the Get data wizard, navigator, and model view; link to the official Power BI semantic model docs.]

## 3. (Optional) Run "Prep for AI" in Power BI

Power BI has a feature called [**Prep for AI**](https://learn.microsoft.com/fabric/data-science/data-agent-semantic-model) that asks you to confirm AI-friendly schemas, sample questions, and verified answers. If you have time, run it now: it makes the data agent dramatically more accurate.

> [TODO: add specific Prep for AI steps relevant to this dataset, or skip this section if time-constrained in the lab.]

## 4. Publish the semantic model to your Fabric workspace

1. In Power BI Desktop, click **Publish** in the ribbon.
2. Sign in if prompted, and select the **same Fabric workspace** you've been working in.
3. Wait for publish to finish. The semantic model now lives in your Fabric workspace as a Power BI item.

## 5. Create a Fabric data agent

Back in the [Fabric portal](https://app.fabric.microsoft.com), in your workspace:

1. Click **+ New item** → choose **Data agent**.
2. Name it something descriptive, for example, `field-services-agent`.
3. When the agent opens, click **+ Add data source** in the **Explorer** panel on the left.
4. From the OneLake catalog, find the **Power BI semantic model** you just published, select it, and click **Add**.
5. In the **Explorer**, the model's tables appear. Check the boxes next to **ServicePro**, **WorkOrder**, and **Comment** so the agent can use them.
6. Click **Data agent instructions** in the toolbar and add a short note about the domain — for example:

   ```
   This is a field-services work-order management app. Service Pros perform jobs at customer addresses. WorkOrders have a status (pending, assigned, in_progress, completed, needs_followup, cancelled) and may be assigned to one ServicePro. Use ScheduledAt for time-based questions about when jobs happen.
   ```

7. Save the agent.

> [!TIP]
> **Permissions:** you only need **Read** on the semantic model to use it from a data agent, no Build or Write permissions are required.

## 6. Ask the agent a few questions

In the agent's chat pane, try a few natural-language questions:

- `How many work orders do we have in total?`
- `How many work orders are assigned to each Service Pro?`
- `Which Service Pro has the most completed jobs?`
- `List all work orders scheduled for the next 7 days.`
- `Which Service Pros have plumbing in their skills and are currently free (no in-progress jobs)?`

The agent generates a DAX query against the semantic model, runs it, and returns a structured answer (often with a table). You can also click **Show SQL/DAX** to see exactly what query it generated — useful both for trust and for debugging when the answer looks off.

If an answer is wrong or off-target:

- Refine your **Data agent instructions** with extra context.
- Check that the relevant table/column has a clear name and description in the semantic model.
- Re-run "Prep for AI" with verified answers for the question that misfired.

## 7. (Optional) Publish the agent and call it from a Python notebook

If you want to use the agent from code, **publish** it from the agent settings to get a published URL.

> [TODO: confirm the exact "publish agent" UI steps and where the published URL is shown.]

Then create a new **Notebook** item in your Fabric workspace and try the [Fabric Data Agent Python SDK](https://learn.microsoft.com/fabric/data-science/fabric-data-agent-sdk):

```python
%pip install -U fabric-data-agent-sdk
```

```python
from fabric.dataagent.client import FabricDataAgentClient

agent = FabricDataAgentClient(data_agent_name="field-services-agent")
response = agent.ask("How many work orders are scheduled for next week?")
print(response)
```

> [!NOTE]
> **The Fabric Data Agent SDK only runs inside Fabric notebooks** — it isn't supported for local execution. The notebook handles authentication automatically using your Fabric session.

For richer programmatic access patterns (calling from outside Fabric, integrating with an Azure AI agent, etc.), see [Consume Fabric data agent from Microsoft Foundry Services](https://learn.microsoft.com/fabric/data-science/data-agent-foundry).

---

## ✅ Verify

- A Power BI semantic model over the Rayfin SQL database is published in your Fabric workspace.
- A Fabric data agent in the same workspace lists **ServicePro**, **WorkOrder**, and **Comment** as available tables.
- The agent answers at least three plain-English questions about your seeded data with reasonable accuracy.
- *(Optional)* a Fabric notebook calls the published agent and prints a response.
