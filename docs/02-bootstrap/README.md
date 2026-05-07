# 2. Bootstrap app from template

In this step you'll scaffold a brand-new Rayfin project from the **Field Services** template. Bootstrapping from a template saves time so we can focus on the interesting parts of the lab, but this app was originally generated using a **GitHub Copilot CLI template from the rayfin CLI**. If you're curious, after the project is scaffolded you can look in the `/data` folder of the new project to see the original prompt and dataset that were used to generate it.

> 💡 In the Skillable VM, the template is available locally at `/template/field-services-app/`. The `rayfin` CLI knows how to find it by name.

[TODO: not sure the above is true, and we'll need to correct the template path or maybe move it to another git repo, still waiting to hear from rayfin PMs]

---

## 1. Open a working folder

1. In Visual Studio Code, open the folder where you want your new project to live (for example, your home folder or a dedicated `~/labs/` folder).
2. Open a terminal in Visual Studio Code (right-click in an empty area of the Tabs bar → **New Terminal**).

## 2. Copy your Fabric workspace URL

You created a Fabric workspace in [Step 1](../01-setup/README.md#5-create-a-fabric-workspace-and-assign-capacity). The bootstrap command needs that workspace's URL so the new project is wired to deploy into it.

1. Open [https://app.fabric.microsoft.com](https://app.fabric.microsoft.com) in your browser.
2. From the left navigation, open **Workspaces** and click the workspace you created in Step 1 (for example, `lab514-workorders`).
3. Once the workspace page is open, copy the URL from the browser's address bar. It should look like:

   ```
   https://app.fabric.microsoft.com/groups/<workspace-id>
   ```

4. Keep this URL handy — you'll paste it into the next command.

## 3. Scaffold the project

In the Visual Studio Code terminal, create a folder for the new project and switch into it:

```sh
mkdir field-services-app
cd field-services-app
```

Then run (replace `<workspace-uri>` with the URL you just copied):

```sh
npm create @microsoft/rayfin@latest -- --template field-services-app --workspace-uri <workspace-uri>
```

[TODO: check that we can bootstrap from the local template]

When prompted:

| Prompt | What to enter |
| --- | --- |
| **Project name** | `field-services` (or anything you prefer — this becomes the folder name) |
| **Use the Field Services template?** | Press `Enter` to confirm |
| **Install dependencies now?** | `Yes` |

[TODO: check steps above]

The CLI will:

- Copy the template files in the current folder
- Wire the project to your Fabric workspace using the `--workspace-uri` you provided
- Run `npm install` to pull dependencies (this can take a couple of minutes on first run)

## 4. Open the new project

Once the scaffolding finishes, open the new project in Visual Studio Code:

```sh
code .
```

You should see a folder structure that includes:

- `src/` — React + TypeScript frontend
- `rayfin/` — Rayfin backend configuration (`rayfin.yml`, data entities)
- `data/` — Seed data **and the original prompt + dataset used to generate this template** (worth a look if you're curious how it was built)
- `package.json` with `rayfin:dev`, `rayfin:db`, and `dev` scripts ready to go

You'll explore these folders in detail in [Step 3](../03-explore-template/README.md).

---

## ✅ Verify

- A new project folder was created and you can see it in the Visual Studio Code Explorer
- `npm install` completed without errors
- Running `npx rayfin --version` inside the new project prints a version number

---

Prev ← [1. Setup & prerequisites](../01-setup/README.md) · Next → [3. Explore the template](../03-explore-template/README.md)

