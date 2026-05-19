# 🚀 Get Started

**This repo is where attendees go to continue their learning after your session — and your Copilot agent will help you set it up.**

### Step 1: Open your repo

Open this repo in a **Codespace** (click the green **Code** button → **Create a Codespace**) — or clone it locally. Then open **GitHub Copilot Chat**.

### Step 2: Add your content

Give the agent something to work with. Drag files into the Explorer panel — session abstracts, outlines, screenshots, notes — and drop them in one of two places:

| Where to put it | What goes there | Who sees it |
|---|---|---|
| **`_remove-before-publish/`** | Internal reference materials (abstracts, outlines, screenshots, planning docs) | **Copilot only** — never published |
| **`/docs/`, `/src/`, or repo root** | Lab instructions, demo code, sample data, getting-started guides | **Attendees** — published with the repo |

> 💡 Not sure? Start by dropping your session abstract or outline into `_remove-before-publish/`. The agent will figure out what to do with it.

### Step 3: Ask the Agent

Once your content is in the repo, use these three phrases with Copilot to build out your session repo:

| Phrase to use with Copilot | What it does | When to run it |
|---|---|---|
| **"Help me get started"** | Sets up session title, description, outcomes, and owners | After you've added your session abstract or outline to the repo |
| **"Help me refine content"** | Organizes your session content into the repo | Each time you add or update content |
| **"Help me finalize"** | Final review, cleanup, and publication prep | When you're ready to publish |

> 💡 **These three phrases are just the starting point.** Copilot can do much more — try asking it to brainstorm next steps for attendees, generate code samples, or build out your repo structure. Don't be afraid to put it in plan mode and ask for what you need.

---

<p align="center">
<img src="img/banner-build-26.png" alt="Microsoft Build 2026" width="1200"/>
</p>

# [Microsoft Build 2026](https://build.microsoft.com)

## 🔥 LAB514: Ship full-stack apps fast with coding agents and a managed backend in Microsoft Fabric

### Session Description

Skip the infra plumbing and ship a real enterprise app. In this hands-on lab, build a work-order management app for Contoso DIY's new home services with Fabric Apps—a managed backend giving you database, auth, hosting, functions, storage, and real-time out of the box. Start from a template, deploy to production in one command, then add features through the Copilot CLI without worrying about migrations. Finish by tapping Fabric intelligence to turn app data into insights.

### 🏫 Getting started in a guided session

To get started in a guided lab session:
- Open the lab environment provided to you
- Sign in to GitHub and to Microsoft Fabric using the credentials shared by the proctor
- Open the [`/docs/`](./docs/README.md) folder and start with [Step 1: Setup Your Environment](./docs/instructions/01-setup.md)

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

Try these prompts with GitHub Copilot to explore the topics from this lab. Open Copilot Chat in VS Code (`Ctrl+Alt+I` on Windows/Linux, `Cmd+Shift+I` on Mac), paste a prompt, and see what you learn. Try connecting the [Microsoft Learn MCP Server](#-microsoft-learn-mcp-server) for the latest official documentation.

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


### 🌟 Microsoft Learn MCP Server

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Microsoft_Docs_MCP-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect/mcp/install?name=microsoft.docs.mcp&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Flearn.microsoft.com%2Fapi%2Fmcp%22%7D)

The Microsoft Learn MCP Server is a remote MCP Server that enables clients like GitHub Copilot and other AI agents to bring trusted and up-to-date information directly from Microsoft's official documentation. Get started by using the one-click button above for VSCode or access the [mcp.json](.vscode/mcp.json) file included in this repo.

For more information, setup instructions for other dev clients, and to post comments and questions, visit our Learn MCP Server GitHub repo at [https://github.com/MicrosoftDocs/MCP](https://github.com/MicrosoftDocs/MCP). Find other MCP Servers to connect your agent to at [https://mcp.azure.com](https://mcp.azure.com).

*Note: When you use the Learn MCP Server, you agree with [Microsoft Learn](https://learn.microsoft.com/en-us/legal/termsofuse) and [Microsoft API Terms](https://learn.microsoft.com/en-us/legal/microsoft-apis/terms-of-use) of Use.*

## Content Owners

<!-- TODO: Add yourself as a content owner
1. Change the src in the image tag to {your github url}.png
2. Change INSERT NAME HERE to your name
3. Change the github url in the final href to your url. -->

<table>
<tr>
    <td align="center"><a href="http://github.com/sinedied">
        <img src="https://github.com/sinedied.png" width="100px;" alt="Yohan Lasorsa"/><br />
        <sub><b>Yohan Lasorsa</b></sub></a><br />
            <a href="https://github.com/sinedied" title="talk">📢</a>
    </td>
</tr></table>

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [Contributor License Agreements](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
