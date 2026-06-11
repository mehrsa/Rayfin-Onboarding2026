
## 🔥Ship full-stack apps fast with coding agents and a managed backend in Microsoft Fabric

### Session Description

Skip the infra plumbing and ship a real enterprise app. In this hands-on lab, build a work-order management app for Contoso DIY's new home services with Fabric Apps—a managed backend giving you database, auth and hosting out of the box. Start from a template, deploy to production in one command, then add features through the Copilot CLI without worrying about migrations. Finish by tapping into Fabric intelligence to turn app data into insights.
### 🏠 Getting started in your own environment

If you're following these steps at your own pace:
- Clone this repository
- Complete [Step 1: Setup Your Environment](./docs/instructions/01-setup.md) to install Node.js, the GitHub Copilot CLI, and the Microsoft Fabric tooling
- Sign in to a Microsoft Fabric workspace where you have permission to deploy apps (note: deploying may incur cloud costs)
- Work through the lab steps starting at [`/docs/`](./docs/README.md)

### 🧠 Learning Outcomes

By the end of this lab, you will be able to:

- Bootstrap and deploy a production-ready enterprise app using Fabric Apps templates with a single command
- Use the GitHub Copilot CLI to add new features and evolve your app's data schema without manually managing migrations
- Leverage Microsoft Fabric intelligence (semantic models and data agents) to turn application data into actionable insights

### 💬 Keep Learning with Copilot

Try these prompts with GitHub Copilot to explore the topics from this lab. Open Copilot Chat in Visual Studio Code (`Ctrl+Alt+I` on Windows/Linux, `Cmd+Shift+I` on Mac), paste a prompt, and see what you learn. Try connecting the [Microsoft Learn MCP Server](#-microsoft-learn-mcp-server) for the latest official documentation.

Use these as a starting point — or write your own!

<!-- Prompts will be tailored to this session's content during repo setup. -->

1. Understand Fabric Apps:

   ```
   Using the Microsoft Learn MCP Server, find the latest documentation on Fabric Apps and explain what problems it solves compared to building an enterprise app from scratch on Azure.
   ```

2. Try the Copilot CLI workflow:

   ```
   Help me install the GitHub Copilot CLI, then walk me through using it to add a new field to an existing TypeScript data model and generate the matching database migration.
   ```

3. Build something with a template:

   ```
   Show me how to bootstrap a new Fabric Apps project from a template, run it locally, and deploy it to a Fabric workspace in one command.
   ```

4. Go deeper on data agents:

   ```
   Using the Microsoft Learn MCP Server, find the latest docs on Microsoft Fabric data agents and walk me through creating one over a semantic model so I can ask natural-language questions about my app's data.
   ```

5. Connect from a notebook:

   ```
   Help me write a Python notebook that connects to a published Fabric data agent using the OpenAI SDK and runs a few sample queries.
   ```

### 💻 Technologies Used

1. [Rayfin](aka.ms/rayfin)
1. [GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/use-copilot-agents/use-copilot-in-the-cli)
1. [Microsoft Fabric](https://learn.microsoft.com/fabric/) — semantic models and data agents
1. [Visual Studio Code](https://code.visualstudio.com/docs)
1. [TypeScript](https://learn.microsoft.com/training/paths/build-javascript-applications-typescript/)

### 📚 Resources and Next Steps

| Resource | Description |
|:---------|:------------|
| [https://aka.ms/build26-next-steps](https://aka.ms/build26-next-steps) | Take the next step in your learning journey after Build 2026 |
| [Rayfin documentation](aka.ms/rayfin/docs) | Learn about Rayfin CLI and SDK capabilities |
| [Microsoft Fabric documentation](https://learn.microsoft.com/fabric/) | Learn about Fabric capabilities including data, AI, and apps |
| [GitHub Copilot CLI documentation](https://docs.github.com/copilot/how-tos/use-copilot-agents/use-copilot-in-the-cli) | Use Copilot as an agent in your terminal to read, edit, and ship code |
| [Build a data agent in Microsoft Fabric](https://learn.microsoft.com/fabric/data-science/concept-data-agent) | Step-by-step guide to creating a Fabric data agent on top of a semantic model |
| [Microsoft Learn MCP Server](https://github.com/MicrosoftDocs/MCP) | Connect agents to live Microsoft official documentation |

