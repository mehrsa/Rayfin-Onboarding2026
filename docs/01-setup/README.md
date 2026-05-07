# 1. Setup & prerequisites

Before you can build, deploy, and explore the work-order app, you need to get your environment ready and sign in to GitHub, GitHub Copilot, and Microsoft Fabric.

This step takes about 10 minutes if you're working in your own environment. In the guided lab, most prerequisites are already installed on the provided VM, you only need to sign in.

---

## Prerequisites

| | Guided lab (Skillable VM) | Your own environment |
|---|---|---|
| **Node.js 24** | ✅ Pre-installed | Install from [nodejs.org](https://nodejs.org/) (LTS or current ≥ 24) |
| **npm** | ✅ Pre-installed | Bundled with Node.js |
| **Docker Desktop** | ✅ Pre-installed and running | Install from [docker.com](https://www.docker.com/products/docker-desktop/) and make sure it's running before you start the lab |
| **Visual Studio Code** | ✅ Pre-installed | Install from [code.visualstudio.com](https://code.visualstudio.com/) |
| **GitHub Copilot CLI** | ✅ Pre-installed | Run `npm install -g @github/copilot` |
| **GitHub account with Copilot access** | Use the lab account | Use your own GitHub account with an active Copilot subscription |
| **Microsoft Fabric capacity** | Use the lab account | Bring your own Microsoft Fabric tenant — note that deploying may incur cloud costs |

> 💡 Even on the Skillable VM you still need to **sign in** to each service below.

---

## 1. Sign in to GitHub through the lab SSO portal

The lab uses a GitHub Enterprise SSO portal to grant access to GitHub Copilot.

1. Open a browser and go to:

   **[https://github.com/enterprises/skillable-events/sso](https://github.com/enterprises/skillable-events/sso)**

2. Sign in with the **Azure credentials** provided by the proctor (look in the lab Resources panel).
3. Once you're signed in, **keep this browser tab open** — Visual Studio Code will use this active session in the next step.

## 2. Sign in to GitHub Copilot in Visual Studio Code

1. Open Visual Studio Code.
2. Click the **Copilot** icon at the bottom-left of the window and choose **Sign in to use AI Features**. (TODO: add screenshot)
3. When prompted to choose a sign-in method, select **Continue with GitHub**.
4. Complete the browser flow using the SSO session you opened in the previous step.
5. Confirm the Copilot icon appears in the status bar with no error indicator.

## 3. Sign in to GitHub Copilot CLI

The GitHub Copilot CLI uses its own sign-in, separate from Visual Studio Code.

1. In Visual Studio Code, right-click in an empty area of the Tabs bar and select **New Terminal** to open a terminal pane.
2. Start the Copilot CLI:

   ```sh
   copilot
   ```

3. When asked whether to trust the current folder, choose **Yes, and remember this folder for future sessions**.
4. At the Copilot CLI prompt, run:

   ```
   /login
   ```

5. When asked which account to sign in with, choose **GitHub.com**.
6. The CLI will display a device code and a URL. Copy the code, open the URL in your browser, paste the code, and complete the device authorization flow using the SSO session from Step 1.
7. *(Optional)* If the Copilot CLI prompts you that an update is available, run:

   ```
   /update
   ```

   to make sure you're on the latest version.
8. Once you see the signed-in confirmation in the CLI, type `/exit` (or press `Ctrl+C`) to leave the prompt. You'll come back to the Copilot CLI in [Step 6](../06-add-feature/README.md).

## 4. Sign in to Microsoft Fabric

1. In a browser, open [https://app.fabric.microsoft.com](https://app.fabric.microsoft.com).
2. Sign in with:
   - **Guided lab:** the Microsoft account shared by the proctor
   - **Your own environment:** an account that has access to a Microsoft Fabric tenant
3. Confirm the Fabric portal loads.

## 5. Create a Fabric workspace and assign capacity

The lab deploys your app to a Microsoft Fabric workspace, which must be backed by a Fabric capacity.

1. In the Fabric portal, open **Workspaces** in the left navigation and click **+ New workspace**.
2. Give it a name (for example, `lab514-workorders`).
3. Expand **Advanced** → **Workspace type** and ensure **Fabric** is selected.
4. Pick the capacity:
   - **Guided lab:** Under **Details**, you should see a Fabric capacity already assigned to this workspace.
   - **Your own environment:** select your own Fabric capacity. If you don't have once, you can choose to activate a **Fabric trial**.
5. Click **Apply** to create the workspace.

You'll deploy into this workspace in [Step 5](../05-deploy/README.md).

---

## ✅ Verify your setup

Back in the Visual Studio Code terminal you opened in Step 3, run these commands. All should succeed:

```sh
node --version          # v24.x.x
npm --version           # 10.x or newer
docker --version        # Docker version 24+ (and `docker ps` works)
copilot --version       # GitHub Copilot CLI version
```

If any command fails, fix it before moving on. The rest of the lab assumes everything above is working.

---

Next → [2. Bootstrap app from template](../02-bootstrap/README.md)

