@lab.Title

# Get Started

> [!TIP]
> As you follow the instructions in this pane, whenever you see a `icon`, you can use it to copy text from the instruction pane into the virtual machine interface.

## Sign into Windows

In the virtual machine, sign into Windows using the following credentials:

- Username: +++@lab.VirtualMachine(Win11-Pro-Base).Username+++
- Password: +++@lab.VirtualMachine(Win11-Pro-Base).Password+++

## Lab Overview

This lab demonstrates how to go from zero to production with a full-stack enterprise app using Fabric Apps, the Rayfin SDK, and GitHub Copilot CLI. It shows how a managed backend in Microsoft Fabric can provide database, authentication, hosting, schema management, and deployment so builders can focus on product features instead of infrastructure plumbing.

The scenario centers on Contoso DIY, a home-improvement retailer expanding into home services. After customers choose products for projects like painting, hanging, or repairs, Contoso wants to connect them with qualified service pros who can complete the work in the field. To support this new business line, Contoso needs a work-order management app that allows:

- Managers to create work orders
- Managers to assign jobs to service pros
- Service pros to create profiles with their skills
- Service pros to accept and complete assigned jobs
- The business to track operational data and turn it into insights

Through the exercises, you'll explore how Contoso DIY:

- Bootstraps a production-ready field-services app from a template and uses Fabric Apps and Rayfin SDK to model service pros, work orders, authentication, data, and hosting declaratively
- Provisions a managed Fabric backend with a SQL database, authentication, and static hosting with a single command and no cloud configuration
- Uses GitHub Copilot CLI and the Rayfin agent skill to add features across the schema and user interface, applying schema changes locally and in production without hand-writing migrations
- Seeds the deployed app with realistic data and uses Microsoft Fabric intelligence, semantic models, and data agents to ask natural-language questions about operational data

You'll walk in the Contoso DIY team's shoes to build, ship, evolve, and analyze a real enterprise app. The exercises are designed to be completed in order because each step builds on the app, data model, deployment, and resources created in the previous exercises, so make sure you complete each exercise before moving on to the next one.

Select **Next →** to start the lab.

===

# Exercise 1: Setup Your Environment

Before you can build, deploy, and explore the work-order app, you need to get your environment ready by signing in to GitHub, GitHub Copilot, and Microsoft Fabric.

This lab uses a pre-configured virtual machine with all necessary tools installed. The already pre-installed tools include:

- Node.js 24
- npm
- Visual Studio Code
- GitHub Copilot CLI

## Task 1: Sign in to GitHub through the lab SSO portal

In this exercise, you will sign in to GitHub through Contoso DIY's enterprise SSO portal. Contoso DIY purchases GitHub Enterprise for its organization, which includes managed access to GitHub Copilot for employees through the company's enterprise plan.

1. In the virtual machine, open Microsoft Edge and navigate to: `https://github.com/enterprises/skillable-events/sso`

1. On the Single Sign-On page, select **Continue** and sign in using the following credentials:

    - **Email**: +++@lab.CloudPortalCredential(User1).Username+++
    - **TAP**: +++@lab.CloudPortalCredential(User1).AccessToken+++

1. After a successful sign-in, you will be redirected to the GitHub homepage. **Keep this browser tab open** as you will need this active session for the next steps.

## Task 2: Sign in to GitHub Copilot in the terminal

1. In the virtual machine, from the taskbar, select **Windows Terminal** to open a new terminal window.

1. In the terminal, start the Copilot CLI by running: `copilot`.

1. When prompted with "Do you trust the files in this folder?", select **Yes, and remember this folder for future sessions** by navigating with the arrow keys and pressing Enter.

1. Run the following command in the Copilot CLI to start the login process: `/login`.

1. When prompted to choose a sign-in method, select **Github.com**.

1. Press any key to open the browser and sign in using the SSO session from Task 1. The device code is copied to your clipboard automatically, so paste it into the browser when asked.

1. After a successful sign-in, return to the terminal and confirm that you see "Signed in successfully" in the output.

1. *(Optional)*  If the Copilot CLI prompts you that an update is available, run: `/update` to update to the latest version.

1. Exit the Copilot CLI by running: `/exit`. You will start it again in the next exercise when you use it to generate code.

## Task 3: Sign in to Microsoft Fabric

1. In a new tab on the browser, navigate to the Microsoft Fabric portal at: `https://app.fabric.microsoft.com`.

1. When prompted to sign in, use the following credentials:

    - **Email**: +++@lab.CloudPortalCredential(User1).Username+++
    - **TAP**: +++@lab.CloudPortalCredential(User1).AccessToken+++

    > [!Tip]
    > Since you already used these credentials to sign in to the GitHub SSO portal, you may not be prompted to enter them again and will be signed in automatically.

1. After a successful sign-in, you will land on the Microsoft Fabric homepage. **Keep this browser tab open** as you will need this active session for the next steps.

    > [!Important]
    > If the page title and icon in the bottom left corner of the page say "Power BI", you need to switch to the Fabric portal. Click on the **Power BI** icon in the bottom left corner, then select **Fabric** to switch to the Microsoft Fabric portal.

## Task 4: Create a Workspace in Fabric

This lab deploys your work-order app to a Microsoft Fabric workspace.

A workspace is a container for all the Fabric items related to your project, such as databases, notebooks, and deployed applications.

1. In the Fabric portal, select **Workspaces** from the left-hand navigation pane. Then select **+ New workspace**.

1. Name the workspace `Lab514-workorders-@lab.LabInstance.Id`.

1. Expand the **Advanced** section and scroll to the **Workspace type** setting and ensure that **Fabric** is selected.

1. Select **Apply** to create the workspace.

---

## Verify Your Setup

Navigate back to the Windows Terminal and run the following commands to verify that your environment is set up correctly:

```shell
node --version
npm --version
copilot --version
```

Select **Next →** to start the second exercise.

===

# Exercise 2: Bootstrap App from Template

In this exercise, you'll create a new Rayfin project from the **Field Services** template.

The template handles the setup for you, so you can focus on the lab.
> [!TIP]
> In this lab environment, the template is available locally at **C:\LabFiles\template\field-services-app**. The **rayfin** CLI knows how to find it by name.

## Task 1: Bootstrap a new Rayfin project from the Field Services template

1. From the open Windows Terminal, type/add the following command, but **do not press *Enter* yet**. Leave `<workspace-uri>` in place for now.

    ```shell
    npm create -y @microsoft/rayfin@latest -- --project-name field-services-app --template "C:/LabFiles/template/field-services-app" --workspace-uri <workspace-uri>
    ```

1. Navigate back to your browser where you have the Microsoft Fabric portal open.

1. In the left-hand navigation pane, select **Workspaces** and then select the **Lab514-workorders-@lab.LabInstance.Id** workspace you created in Task 5 of the previous exercise.

1. Once the workspace loads, copy the URL from the browser address bar. Remove anything after the workspace ID. The URL should look like `https://app.fabric.microsoft.com/groups/<workspace-id>`

1. Return to the terminal. In the command you pasted, replace `<workspace-uri>` with the Fabric workspace URL you just copied, then press **Enter** to bootstrap a new Rayfin project from the Field Services template.

    The CLI will then:
    - Create a new folder called **field-services-app** in your current directory.
    - Copy the template files into a new **field-services-app** folder.
    - Wire the project to your Fabric workspace using the `--workspace-uri` you provided.
    - Run `npm install` in the new project folder to pull dependencies (this can take a couple of minutes on first run).

1. While the install is running, open the **data** folder at **C:\LabFiles\template\field-services-app** to see the original prompt and dataset used to generate this template. This will give you a better understanding of how the app was built and ideas on how to customize it later in the lab.

## Task 2: Explore the generated project and make your first commit

In this task, you will inspect the generated project, initialize a Git repository, and make your first commit. This is important for GitHub Copilot CLI in later exercises, as it will show you clean diffs and what it will be changing when you ask it to generate code.

1. Open the **field-services-app** folder in Visual Studio Code by running the following command in the terminal:

    ```shell
    code field-services-app
    ```

1. In the pop-up dialog in Visual Studio Code that appears asking if you trust the authors, select **Yes, I trust the authors**.

1. In the Visual Studio Code Explorer, expand the **field-services-app** folder that was created by the bootstrap command.

    !IMAGE[vscode-explorer.png](instructions345417/vscode-explorer.png)

1. Review the project structure. It should look something like this:

    - **src/**: React + TypeScript frontend
    - **rayfin/**: Rayfin backend configuration (*rayfin.yml*, data entities)
    - **data/**: Seed data and **the original prompt + dataset used to generate this template** (worth a look if you're curious how it was built)
    - **package.json**: Dependencies and scripts for the project, including **build** and **dev**.

1. Open the terminal in Visual Studio Code by right-clicking in an empty space of the editor area's tabs bar and select **New Terminal** to open a terminal pane. Alternatively, you can select **View > Terminal** from the top menu.

1. In the Visual Studio Code terminal, run this command to initialize a new Git repository:

    ```shell
    git init
    ```

1. Next, add all the files to the staging area with this command:

    ```shell
    git add .
    ```

1. Finally, make your first commit with this command:

    ```shell
    git commit -m "Initial commit - bootstrap from template"
    ```

Continue with **Next →** to explore the codebase.

===

# Exercise 3: Explore the App Template

In this exercise, you will quickly inspect the app you created in Exercise 2.

You will look at:

- the main project folders
- the Rayfin configuration file
- the Rayfin data model
- the frontend files you may use later

> [!Tip]
> Skim the files. You do not need to understand every line yet.

## Task 1: Explore the project structure

1. In Visual Studio Code, expand the **field-services-app** folder.

1. Notice these files and folders:

    | Folder / file | Why it matters |
    | --- | --- |
    | **rayfin/rayfin.yml** | Turns Rayfin managed services on or off. |
    | **rayfin/data/** | Defines the backend data model. |
    | **src/** | Contains the React + TypeScript frontend. |
    | **src/services/** | Connects the frontend to Rayfin auth and data. |
    | **src/pages/** | Contains the main app pages. |
    | **src/components/ui/** | Contains reusable UI components. |
    | **data/** | Contains the original app spec and seed dataset. |
    | **package.json** | Lists scripts such as *dev*, *rayfin:dev*, *rayfin:db*, *dev:fabric*, *build*, and *test*. |
    | **AGENTS.md** | Gives guidance for AI coding agents. |

    We will review the Rayfin configuration and data model in more detail in the next tasks, review the rest of the files lightly for now.

1. Ignore the generated configuration files for now. You will come back to the important files later.

## Task 2: Explore the Rayfin YAML configuration

The **rayfin/rayfin.yml** file tells Rayfin which services this app uses.

1. Open **rayfin/rayfin.yml**.

1. Find the **services** section.

1. Notice these services:

    | Service | What it does in this app |
    | --- | --- |
    | **auth** | Two providers are enabled: **password** (used for local development) and **fabric** (Microsoft Entra SSO, used when deployed to Microsoft Fabric). |
    | **data** | Creates a managed SQL database for the app. |
    | **storage** | Is turned off in this template, but can be enabled for blob storage. |
    | **staticHosting** | Hosts the built frontend from *dist/* after deployment. |

1. Do not edit this file yet. For now, just learn where the settings live.

## Task 3: Explore the Data Model

The **rayfin/data/** folder defines the database tables for this app.

1. Open **rayfin/data/**.

1. You should see these files:

    - **schema.ts**
    - **ServicePro.ts**
    - **WorkOrder.ts**

1. Open **schema.ts** and review the imports and the **schema** array. Remember this rule: every entity must be imported and added to the **schema** array.

1. Open **ServicePro.ts** and review the **ServicePro** class and notice these decorators:

    - **@entity()** creates a database table.
    - **@role('authenticated', '*')** allows signed-in users to create, read, update, and delete rows.
    - **@uuid()**, **@text(...)**, and **@date()** define columns.
    - **user_id** stores the signed-in user's identity from auth.

    > [!Note]
    > **user_id** is **@text()** because auth provider user IDs are strings. It is not a relationship to another Rayfin entity.

1. Open **WorkOrder.ts** and review the **WorkOrder** class and notice that it has similar decorators to **ServicePro**, but also has some new ones:

    - **@set(...)** limits *status* to known values, such as **pending** and **completed**.
    - **@one(() => ServicePro, { optional: true })** links a work order to a service pro.
    - **servicePro_id** stores the selected service pro ID for the app to read and write.

1. Remember this rule: these TypeScript entity classes are the source of truth for the database schema.

## Task 4 (Optional): Explore the Frontend Code

You do not need to understand the full frontend in this exercise.

1. Open **src/**.

1. If you have time, look at these files:

    - **services/ServiceContainer.ts** — singleton that bootstraps the Rayfin client and auto-selects the right auth provider (password locally, Fabric Entra in production).
    - **services/rayfin/RayfinFieldService.ts** — CRUD operations for *ServicePro* and *WorkOrder* using the typed Rayfin data API.

1. Keep these ideas in mind:

    - The frontend uses types generated from the Rayfin schema.
    - If you change a field in **rayfin/data/**, TypeScript can help find frontend code that needs updating.
    - The app does not use a hand-written REST client.

---

## Knowledge Check

@lab.Activity(DataModelQuestion)

@lab.Activity(ManagedServicesQuestion)

If either question is unclear, review Task 2 and Task 3 before continuing.

Continue with **Next →** to run the App locally.

===

# Exercise 4: Run the App Locally

In this exercise, you will run the Field Services app locally.

You will:

- **Provision a Fabric backend** for the app with one command
- Start the **frontend dev server** locally
Then you will sign in, create a Service Pro profile, complete a work order, and test the manager view.

## Task 1: Provision the Fabric backend

The **rayfin up** command provisions a managed backend (database, auth, data API) in your Fabric workspace and wires your local frontend to talk to it.

1. Use the VS Code terminal from the previous exercise. It should already be in the **field-services-app** folder.

1. Provision the Fabric backend by running:

    ```shell
    npx rayfin up
    ```

1. As this is your first time deploying, the CLI will:

    - Open a browser to sign you in to Microsoft Entra. Authentication will be automatic since you already have an active SSO session from Exercise 1.
    - **Create a Fabric App item** in the workspace you wired up at bootstrap.
    - **Provision a managed SQL database** for your data model.
    - **Apply your schema** to that database.
    - **Generate a publishable key** for the new backend.
    - **Wire your frontend** to the new backend by writing the connection details and key into *.env.local* and *rayfin/.env*.

1. Watch the terminal for progress on each step. The first run takes a couple of minutes.

1. When the command finishes, the CLI prints the deployment details, including the backend URL.

> [!TIP]
> The CLI saves the deployment details to **rayfin/.deployments.json** so subsequent **rayfin up** runs update the same deployment instead of creating a new one.

## Task 2: Start the frontend

The frontend is the React app that users interact with.

1. In the same terminal, start the Vite dev server:

    ```shell
    npm run dev
    ```

    Because **rayfin up** already wrote the backend URL and publishable key into **.env.local**, Vite picks them up automatically. Your locally-served frontend talks to the freshly provisioned Fabric backend with no extra configuration.

1. Copy the local frontend URL shown in the terminal, which should be similar to `http://localhost:5173`, and open it in a new browser tab.

1. Confirm that the app sign-in page opens.

## Task 3: Sign up as a Service Pro

The authentication page includes a **"Sign in with Microsoft"** button, and the backend uses Microsoft Entra (Fabric SSO) for sign-in.

1. Select the **Sign in with Microsoft** button. Since you already have an active SSO session from Exercise 1, you should be signed in automatically without needing to enter credentials again. Otherwise, sign in with the same Microsoft account you used for Fabric:
    - **Email**: +++@lab.CloudPortalCredential(User1).Username+++
    - **TAP**: +++@lab.CloudPortalCredential(User1).AccessToken+++

1. After successful sign-in, a Microsoft Fabric dialog will pop up asking you to allow the app to use your Microsoft Fabric credentials. Select **Accept** to continue.

1. After successful authentication, you should land in the Service Pro First Access view where you can create your profile.

1. Create your Service Pro profile by entering your name and relevant skills.

1. For the skills, enter a few relevant skills such as:

    ```text
    painting, hanging, drilling
    ```

1. Complete the profile creation by selecting **Create Profile**.

1. After your profile is created, you should see the **Jobs** view with the seeded work order for you to test with.

1. Accept the work order by selecting the **Accept job** button on the work order card.

1. Mark the work order complete by selecting the **Mark done** button on the work order card.

## Task 4: Explore the manager view

The same app also includes a manager view.

1. Open a new browser tab and navigate to the manager URL:

    ```text
    http://localhost:5173/manager/
    ```

1. Review the manager view and create a new work order by completing the form and selecting **Create order**.

1. Assign the work order to your Service Pro profile.

1. Select **Jobs** in the top navigation bar.

1. Confirm that the assigned work order appears for the Service Pro.

1. Back in the Visual Studio Code terminal, stop the Vite dev server by pressing **Ctrl+C**.

Continue with **Next →** to deploy the app to production.

===

# Exercise 5: Verify the Production Deployment on Microsoft Fabric

In Exercise 4, you ran **npx rayfin up** to provision the Rayfin backend in Microsoft Fabric. That command also built the frontend by running **npm run build:fabric**, uploaded the compiled app to Microsoft Fabric's managed static hosting, and deployed the schema.

In this exercise, you will verify the live deployment created by **rayfin up**. There is no separate production publishing step for this lab: each **rayfin up** updates the deployment associated with your selected Microsoft Fabric workspace.

You will:

- Open the hosted app URL generated by **rayfin up**
- Sign in with Microsoft Fabric
- Confirm that the hosted app uses the same backend, database, and schema as the app you tested locally
- Optionally inspect the deployed app and SQL Database items in the Microsoft Fabric portal

## Task 1: Open the live app

1. In the terminal output from the `npx rayfin up` command you ran in Exercise 4, find the **static hosting URL** printed by the CLI. The URL should look similar to `https://<random-prefix>.webapp.rayfin….com`.

    !IMAGE[rayfin-up.png](instructions345417/rayfin-up.png)

    > [!TIP]
    > If you missed the hosting URL, run `npx rayfin up status` from the **field-services-app** folder to print the current deployment details.

1. Open the hosting URL in a new browser tab. The app displays the same auth page as your local frontend, including the **Sign in with Microsoft** button, because both use the same Fabric backend.

1. Select **Sign in with Microsoft** just like you did in Exercise 4.

1. After authentication completes, confirm that you land in the Service Pro view.

1. Confirm that you can see the same profile and work orders you created in the previous exercise. This verifies that the hosted app is using the same database as the app you tested locally.

1. Navigate to `/manager/` and create a couple of new work orders.

At this point, you have verified that the app is live. Any user with access to your Microsoft Fabric workspace can open the hosted app and use the deployed backend.

> [!Tip]
> **Need separate dev and production environments?** Run `npx rayfin up` against a second Microsoft Fabric workspace to create a separate deployment with its own backend, database, and frontend. Then switch between deployments anytime with `npx rayfin up switch`. Each deployment is tracked independently in **rayfin/.deployments.json**.

## Task 2: Inspect the deployment in Fabric

Let's take a look at the deployed app and database in the Microsoft Fabric portal.

1. Open the Microsoft Fabric portal at `https://app.fabric.microsoft.com`.

1. Open the **Lab514-workorders-@lab.LabInstance.Id** workspace you created in Exercise 1.

1. Confirm that the workspace contains a **Fabric data app** item and a **SQL Database** item. The **ServicePro** and **WorkOrder** tables are stored in the SQL Database item.

1. Select the Fabric SQL Database item to open it, and in the left explorer, expand the **field-services-app** database and then expand **dbo > Tables** to see the **ServicePro** and **WorkOrder** tables.

1. Select each table to see the data contained within it.

    !IMAGE[fabric-sql-tables.png](instructions345417/fabric-sql-tables.png)

Continue with **Next →** to update the app with a new feature.

===

# Exercise 6: Add a Feature with Copilot CLI

In the previous exercises, you deployed the Field Services app to Microsoft Fabric and confirmed that the hosted app uses the same Rayfin backend as your local development experience. In this exercise, you will use GitHub Copilot CLI to implement a schema-backed comments feature for work orders.

The comments feature gives each work order a conversation thread where service pros and managers can discuss job details over time. Implementing this feature requires changes across the Rayfin data model, permissions, typed data access, and React user interface.

By completing this exercise, you will:

- Review the project-specific agent instructions that guide GitHub Copilot CLI.
- Launch GitHub Copilot CLI from the Field Services app project.
- Generate a Rayfin-backed **Comment** entity and comments user interface.
- Review the generated schema, permission, data access, and frontend changes.
- Apply the schema update to the Microsoft Fabric backend.
- Redeploy the app and validate the comments workflow locally and in the hosted app.

## Task 1: Review the project agent instructions

The app template includes agent instructions that help GitHub Copilot CLI generate Rayfin code that follows the project's conventions.

The Rayfin agent skill provides domain guidance for entities, decorators, permissions, schema updates, and typed client usage. The project-level **AGENTS.md** file adds repository-specific context, including architecture notes, important files, and implementation conventions.

1. In Visual Studio Code, Open **AGENTS.md** at the project root.

1. Review the guidance so you understand the context GitHub Copilot CLI will use while editing this project.

1. Open **package.json** and confirm that **@microsoft/rayfin-mcp** is listed in the development dependencies.

    > [!Tip]
    > The template installs the Rayfin agent skill automatically. If you start from a blank project in the future, install the agent files by running `npx rayfin init ai-files install` from the project folder.

## Task 2: Launch GitHub Copilot CLI

Start GitHub Copilot CLI from the app project folder so it can read the project files, agent instructions, and Rayfin configuration.

1. Open a terminal in Visual Studio Code.

1. Launch GitHub Copilot CLI:

    ```shell
    copilot --yolo
    ```

    > [!Tip]
    > The `--yolo` option automatically approves tool calls such as file edits and terminal commands. Use it only in a controlled lab workspace that does not contain secrets, production data, or changes you cannot easily revert.

1. In the GitHub Copilot CLI prompt, open the model picker by typing the following command and enter:

    ```text
    /model
    ```

1. Select **GPT-5.4** by using the arrow keys and enter, and choose **low** reasoning effort.

    > [!Tip]
    > The model selection applies to the current GitHub Copilot CLI session. If you exit and start GitHub Copilot CLI again, repeat this step.

## Task 3: Generate the comments feature

Use GitHub Copilot CLI to generate the comments feature without applying the backend schema change yet.

1. In the GitHub Copilot CLI prompt, paste the following implementation request:

    ```text
    Implement a comments feature for work orders. Comments should provide a history of interventions so service pros and the manager can communicate and ask questions about a work order. Each comment must include id, userId, createdAt, workOrderId, and content. Keep the comments section collapsed by default in the UI. Only the service pro assigned to the work order and the manager can view and add comments for a work order. Generate the code only; do not apply the backend schema change.
    ```

1. Allow GitHub Copilot CLI to plan and apply the code changes.

1. As the implementation runs, confirm that GitHub Copilot CLI is making changes consistent with the request, including:

    - A new **WorkOrderComment** entity under **rayfin/data/**
    - An update to **rayfin/data/schema.ts** that exports the new entity
    - Permission logic that limits comments to the assigned service pro and the manager
    - React user interface changes that add a collapsed-by-default **Comments** section to work-order details
    - Typed Rayfin client calls that fetch and create comments

    > [!Note]
    > Your entity could be named **Comment** or **WorkOrderComment** or something similar. The important part is that it includes the required fields and is properly exported from the schema. For purposes of this lab, the instructions will refer to it as **WorkOrderComment**, but the actual name may vary.

## Task 4: Review the generated implementation

Before applying backend changes, review the files generated by GitHub Copilot CLI.

1. Open the Visual Studio Code Source Control view.

    !IMAGE[vscode-source-control.png](instructions345417/vscode-source-control.png)

1. Review each changed file.

1. Confirm that the implementation includes a comment entity, schema registration, permission logic, data access updates, and user interface updates.

1. If you prefer the terminal, run `git status` or `git diff` from the **field-services-app** folder to inspect the same changes. Expected changes include:

    - A new file under **rayfin/data/**, such as **WorkOrderComment.ts**
    - An update to **rayfin/data/schema.ts**
    - New or updated files under **src/components/**, **src/pages/**, **src/hooks/**, or **src/services/**
    - A comments user interface that is collapsed by default

> [!Note]
> The implementation should rely on Rayfin decorators, schema generation, permission policies, and the typed client. You should not need to create a hand-written REST endpoint, migration script, or authorization middleware for this feature.

## Task 5: Apply the schema update and redeploy

The implementation request asked GitHub Copilot CLI to generate code without applying backend changes. To test the feature, apply the new schema to the Microsoft Fabric backend and redeploy the app.

1. Exit GitHub Copilot CLI by typing `/exit` in the prompt.

1. In a terminal in the **field-services-app** folder, apply the database schema update:

    ```shell
    npx rayfin up db apply
    ```

1. Confirm that the command completes successfully and creates the new **WorkOrderComments** table.

    !IMAGE[fabric-workordercomments-table.png](instructions345417/fabric-workordercomments-table.png)

    > [!Note]
    > If the command warns about destructive changes, stop and review the listed operations before continuing. Adding a new entity should not require dropping or renaming existing columns.

1. Deploy the updated backend API metadata and frontend:

    ```shell
    npx rayfin up
    ```

    > [!Note]
    > The full `rayfin up` flow can also apply pending database migrations. In this lab, you applied the database change first so the schema update is visible as a separate step.

## Task 6: Validate the comments workflow

Test the comments feature from both the local development app and the hosted app.

1. Start the local Vite dev server if it's not already running:

    ```shell
    npm run dev
    ```

1. Open the local app at the Vite dev server URL, such as `http://localhost:5173`.

1. Open a work order assigned to your Service Pro profile.

1. Expand the new **Comments** section.

1. Add a comment to the work order.

1. Navigate to the manager view at `/manager/`.

1. Open the same work order and confirm that the manager can see the comment thread.

1. Add a reply from the manager view.

1. Return to the Service Pro view and confirm that the reply appears in the same thread.

1. Open the live hosting URL from Exercise 5 and repeat a quick smoke test to confirm that the deployed app also includes the comments feature.

## Task 7: Refine the implementation if needed

If the feature does not work as expected, use GitHub Copilot CLI to make a targeted fix. Include the observed behavior, error message, or screenshot details in your follow-up prompt.

Example follow-up prompts:

```text
The Comments section is not collapsed by default. Please fix it.
```

```text
This error appears when I post a comment: <paste the error message>. Please fix it.
```

```text
The manager cannot see comments on assigned work orders. Please review the permissions and fix the issue.
```

After GitHub Copilot CLI applies a fix, repeat the relevant validation steps from Task 5 and Task 6.

You have completed the feature implementation and validation workflow for the Field Services app.

Continue with **Next →** to Seed Data for Analysis.

===

# Exercise 7: Seed Data for Analysis

In Exercise 6, you implemented and deployed a schema-backed comments feature. In this exercise, you will seed the backend with a richer dataset for the analysis-focused steps that follow.

Seeding data provides a realistic set of service pros, work orders, and statuses so the next analysis-focused exercises have meaningful data to query.

By completing this exercise, you will:

- Use the built-in admin experience to seed the database.
- Confirm that the app now includes a larger, more realistic dataset.
- Optionally add additional comments to improve downstream analysis scenarios.

## Task 1: Open the admin page and seed the database

The template includes an authenticated admin page at `/_admin/` that can generate a larger dataset from **src/data/field-service-seed.json**.

1. In the hosted app, navigate directly to `/_admin/` by appending it to the hosting URL.

1. Confirm that the admin page is accessible while you are signed in.

1. Select **Seed data**.

1. Wait for the operation to complete.

1. Confirm that the completion message reports the number of generated service pros and work orders.

    > [!Tip]
    > The admin page can also reset the data back to a minimal sample dataset. Use reset only if you need to return to a small baseline.

## Task 2: Validate the seeded dataset in the app

After the seed operation completes, confirm that the larger dataset is visible in the main app experiences.

1. Return to the Service Pro view.

1. Confirm that you now see a broader set of work orders across multiple statuses.

1. Open the manager view at `/manager/`.

1. Confirm that the manager view now shows a larger set of service pros and work orders.

1. Open a few records and verify that seeded data includes varied skills, locations, and operational states.

## Task 3: (Optional) Add more comments for richer analysis

If time permits, add comments to multiple work orders so downstream analysis has richer conversational data.

1. Open several work orders in both Service Pro and manager views.

1. Add one or more comments per work order.

1. Confirm that each thread remains visible to both the assigned service pro and the manager.

This optional step improves the quality of natural-language insights in the next part of the lab.

You now have a production-deployed app with a realistic dataset ready for analysis-oriented workflows.

Continue with **Next →** to Explore Data with Fabric Intelligence.

===

# Exercise 8: Explore Data with Fabric Intelligence

In Exercise 7, you seeded the database with a realistic production dataset. In this exercise, you will use Microsoft Fabric intelligence capabilities to query that data using natural language.

The Microsoft Fabric SQL Database provisioned by Rayfin is a first-class citizen in your Fabric workspace. You will build a Power BI semantic model over it, publish it to Fabric, and create a **Fabric data agent** that lets you ask questions like "Which Service Pro has the most completed jobs?" without writing a single line of SQL.

By completing this exercise, you will:

- Build and publish a semantic model over the service pro, work order, and comments tables.
- Create a Fabric data agent backed by the semantic model.
- Query the agent with natural-language questions about your production data.
- Optionally call the agent from a Fabric notebook using the Fabric Data Agent SDK.

## Task 1: Build a Semantic model

A semantic model gives the data agent a clean, well-described view of your data — including table relationships, friendly column names, and descriptions so it can translate natural-language questions into accurate queries.

1. Navigate to the Microsoft Fabric portal and open the workspace you created for this lab.

1. Select **+ New item** from the top menu and in the dialog, search and select **Semantic model**.

1. In the semantic model creation experience, select **OneLake catalog** as the data source type.

    !IMAGE[fabric-create-semantic-model.png](instructions345417/fabric-create-semantic-model.png)

1. Select the SQL Database item and select **Connect**.

    !IMAGE[fabric-select-sql-database.png](instructions345417/fabric-select-sql-database.png)

1. Provide a name for the semantic model, in this case, `FieldServices`.

1. Select the **ServicePros**, **WorkOrders**, and **WorkOrderComments** tables to include in the model and select **Confirm** to create the model.

    !IMAGE[fabric-select-tables-semantic-model.png](instructions345417/fabric-select-tables-semantic-model.png)

    > [!Note]
    > This process will take a few minutes to complete.

1. Define the relationship between the **ServicePros** and **WorkOrders** tables by dragging the **servicePro_id** column from **WorkOrders** onto the **id** column in **ServicePros**.

1. Power BI Service will automatically determine the cardinality and cross-filtering direction. Select **Save** in the New relationship dialog.

1. Define the relationship between the **WorkOrders** and **WorkOrderComments** tables by dragging the **id** column from **WorkOrders** onto the **workOrder_id** column in **WorkOrderComments**.

1. Again, confirm the relationship settings in the New relationship dialog and select **Save**.

1. Rename key columns to clear, readable labels. For each of the three tables rename the following columns:

    a. ServicePros:
    - **id** → `ServiceProId`

    b. WorkOrders:
    - **id** → `WorkOrderId`
    - **scheduledAt** → `ScheduledDate`

    To rename a column, select it in the **Data** view, then expand each table to view its columns. Right-click the column and select **Rename**.

1. Select each table and add descriptions to the tables from the **Properties** pane. The descriptions are as follows:

    - ServicePros: `Service professionals who perform jobs at customer locations. Each has a set of skills and may be assigned to work orders.`
    - WorkOrders: `Work orders for field service jobs. Each has a status, may be assigned to a Service Pro, and has a scheduled date.`
    - WorkOrderComments: `Comments on work orders. Each comment is associated with a single work order and includes content, the authoring user, and a timestamp.`

    !IMAGE[fabric-add-table-descriptions.png](instructions345417/fabric-add-table-descriptions.png)

    > [!Tip]
    > Adding descriptions is optional but highly recommended, as the data agent uses them to understand your data and answer questions accurately. Spend a few minutes here, it pays back tenfold in agent answer quality.

## Task 2: Create a Fabric data agent

1. Switch to your workspace on the left navigation pane and select **+ New item** from the top menu.

1. In the dialog, search for and select **Data agent**.

1. Name the agent `field-services-agent`.

1. In the **Explorer** panel, select **Add Data > Data Source**.

1. In the **Add data source** dialog, select the **Semantic model** you created in Task 1 and select **Add**.

    !IMAGE[fabric-add-data-source-agent.png](instructions345417/fabric-add-data-source-agent.png)

1. In the explorer panel, select the tables you want the agent to have access to. Check the boxes next to **ServicePros**, **WorkOrders**, and **WorkOrderComments**.

1. Select **Agent Iinstructions** in the toolbar and add the following domain context, deleting any placeholder text:

    ```text
    This is a field-services work-order management app. Service Pros perform jobs at customer addresses. WorkOrders have a status (pending, assigned, in_progress, completed, needs_followup, cancelled) and may be assigned to one ServicePro. Use Scheduled date for time-based questions about when jobs happen.
    ```

1. Close the Agent Instructions editor.

## Task 5: Query the agent with natural-language questions

Use the agent's chat interface to ask questions about your seeded production data.

1. In the agent chat pane, ask the following questions one at a time and review the results:

    - `How many work orders do we have in total?`
    - `How many work orders are assigned to each Service Pro?`
    - `List all work orders scheduled for the next 7 days.`
    - `Which Service Pros have plumbing in their skills and have no in-progress jobs?`

1. For each response, expand the steps completed to see the generated DAX query and the returned answer.

1. Publish the data agent by selecting **Publish** from the top toolbar. Once published, the agent can be accessed from other Fabric experiences such as notebooks and the standalone Copilot experience.

1. In the publish dialog, provide the following description for the agent:

    ```text
    This agent answers questions about field service work orders, including assigned service professionals, job statuses, and scheduled dates.
    ```

    > [!Tip]
    > The description is important as it helps other agents and copilot experiences understand the agent's purpose and capabilities. A clear description improves the chances of the agent being recommended for relevant questions.

1. Select the **Standalone Copilot** from the left navigation pane.

1. In the Copilot text input, ask a question that the agent should be able to answer, such as:

    ```text
    List all work orders scheduled for the next 7 days.
    ```

    You should see the response from copilot using the data agent as its knowledge source.

You have successfully created a Fabric data agent over your production data and used it to answer natural-language questions.

Continue with **Next →** for the conclusion of the lab and next steps.

===

# You're done 🎉

In one lab session you just:

1. Bootstrapped a full-stack Fabric App from a template.
2. Ran it locally with **rayfin CLI**.
3. Deployed it to Microsoft Fabric with one command.
4. Added a real schema-backed feature using the GitHub Copilot CLI and the rayfin agent skill.
5. Pushed the change back to production with the same one-command deploy.
6. Seeded production data and built a natural-language interface over it with a Fabric data agent.

No infrastructure scripts. No migration files written by hand. No bespoke auth plumbing. **From zero to a deployed, intelligent enterprise app — using a managed backend, decorators, and coding agents.**

I hope you enjoyed the lab and are excited about the possibilities of building with Microsoft Fabric and Rayfin SDK. The tools and patterns you saw here are designed to help you build faster, smarter, and more maintainable applications on top of Microsoft Fabric's powerful data and AI capabilities.
