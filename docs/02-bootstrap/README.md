
# Bootstrap app from template

In this step you'll scaffold a brand-new project using Rayfin SDK using the **Field Services** template. Bootstrapping from a template saves time so we can focus on the interesting parts of the lab, but this app was originally generated using the **GitHub Copilot CLI template from the Rayfin CLI**. If you're curious, after the project is scaffolded you can look in the `/data` folder of the new project to see the original prompt and dataset that were used to generate it.

## What is Rayfin?
Rayfin is the SDK and CLI behind **Fabric Apps** — Microsoft Fabric's managed backend for full-stack apps. The **Rayfin SDK** is a set of TypeScript libraries: you describe your data model with decorators (`@entity`, `@uuid`, `@text`, `@one`…), and the SDK generates a typed client, a managed database schema, authentication, storage, and an HTTP/GraphQL API for you. The **Rayfin CLI** is the command-line tool that wires it all together: scaffold a project, run it locally in Docker, apply schema changes, and deploy to a Fabric workspace. Together, they let you go from data model to a deployed full-stack app without writing infrastructure, migrations, or auth plumbing yourself.

---

## 1. Open a working folder

1. In Visual Studio Code, open the folder where you want your new project to live (for example, your home folder).
2. Open a terminal in Visual Studio Code (right-click in an empty space of the editor's area tabs bar → **New Terminal**).

## 2. Copy your Fabric workspace URL

You previously created a Fabric workspace. The bootstrap command needs that workspace's URL so the new project is wired to deploy into it.

1. Open [https://app.fabric.microsoft.com](https://app.fabric.microsoft.com) in your browser.
2. From the left navigation, open **Workspaces** and click the workspace you created in Step 1 (for example, `lab514-workorders`).
3. Once the workspace page is open, copy the URL from the browser's address bar. It should look like:

   ```
   https://app.fabric.microsoft.com/groups/<workspace-id>
   ```

4. Keep this URL handy — you'll paste it into the next command.

## 3. Scaffold the project

In the Visual Studio Code terminal, create a new folder with:

```sh
mkdir field-services-app
cd field-services-app
```

Then run this command (replace `<workspace-uri>` with the URL you just copied):

```sh
npm create @microsoft/rayfin@latest -- --project-name field-services-app --template "C:/LabFiles/template/field-services-app" --workspace-uri <workspace-uri>
```

The CLI will:

- Copy the template files in the current directory
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

We'll explore these folders in detail in the next page.

## 5. Initialize git and commit

Initialize a git repository so you can track changes and show clean diffs when we'll update the code.

In the Visual Studio Code terminal, from inside the new project folder:

```sh
git init
git add .
git commit -m "Initial commit"
```

---

## ✅ Verify

- A new project folder was created and you can see it in the Visual Studio Code Explorer
- `npm install` completed without errors
- Running `npx rayfin --version` inside the new project prints a version number

Continue with **Next →** to explore the codebase.