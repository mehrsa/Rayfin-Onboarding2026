# Exercise 2: Bootstrap App from Template

In this exercise, you will scaffold a brand-new Rayfin project from the **Field Services** template. Bootstrapping from a template saves time so we can focus on the interesting parts of the lab, but this app was originally generated using a GitHub Copilot CLI template from the rayfin CLI. If you're curious, after the project is scaffolded you can look in the /data folder of the new project to see the original prompt and dataset that were used to generate it.
> [!Tip]
> In this lab environment, the template is available locally at `/template/field-services-app`. The `rayfin` CLI knows how to find it by name.

## Task 1: Open a working folder

1. In Visual Studio Code, select **File** > **Open Folder** from the menu, and create a new folder named `lab514-@lab.LabInstance.id` on the VM desktop. Select this folder and press **Select Folder** to open it in Visual Studio Code.

1. Once the folder is open, open a new terminal in Visual Studio Code by right clicking on an empty area of the tabs bar and selecting **New Terminal**.

## Task 2: Copy your Fabric Workspace URL

The bootstrap command will ask you to select a destination for your new project. Since we will be deploying this app to Microsoft Fabric later, we can save some time by copying the URL of our Fabric workspace now and using it during the bootstrap process. 

1. Navigate back to your browser where you have the Microsoft Fabric portal open.

1. In the left-hand navigation pane, select **Workspaces** and then select the **Lab514-workorders-@lab.LabInstance.Id** workspace you created in Task 5 of the previous exercise.

1. Once the workspace loads, copy the URL from the browser address bar and save it for the next task. It should look something like this: 

    `https://app.fabric.microsoft.com/groups/<workspace-id>`

1. Keep this URL handy, as you will need to paste it in during the bootstrapping process in the next task.

## Task 3: Bootstrap a new Rayfin project from the Field Services template

1. In the terminal in Visual Studio Code, create a new folder with the following command. This is where the new project will be generated.

    ```shell
    mkdir field-services-app
    cd field-services-app
    ```

1. Run the following command to bootstrap a new Rayfin project from the Field Services template. Replace `<workspace-uri>` with the URL of your Fabric workspace that you copied in Task 2.

    ```shell
    npm create @microsoft/rayfin@latest -- --project-name field-services-app --template "C:/LabFiles/template/field-services-app" --workspace-uri <workspace-uri>
    ```

1. The CLI will do the following:
    - Copy the template files in the current directory.
    - Wire the project to your Fabric workspace using the --workspace-uri you provided.
    - Run `npm install` to pull dependencies (this can take a couple of minutes on first run).

## Task 4: Open the new project in Visual Studio Code

1. Once the bootstrapping process is complete, you can now open the new project in Visual Studio Code. Use the following command in the terminal:

    ```shell
    code .
    ```

1. This will open the new project in a new Visual Studio Code window. You can explore the files and folders to see the structure of the project. The folder structure should look something like this:

    - `src/`: React + TypeScript frontend
    - `rayfin/`: Rayfin backend configuration (`rayfin.yml`, data entities)
    - `data/`: Seed data and **the original prompt + dataset used to generate this template** (worth a look if you're curious how it was built)
    - `package.json`: This file contains the dependencies and scripts for the project including `rayfin:dev`,`rayfin:db` and `dev` scripts.

## Task 5: Initialize a Git repository and make your first commit

In this task, you will initialize a Git repository in your new project and make your first commit. This is important for GitHub Copilot CLI in later exercises, as it will show you clean diffs and what it will be changing when you ask it to generate code.

1. In the Visual Studio Code terminal, within the new project folder, run this command to initialize a new Git repository:

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

---

## Verify Your Setup

To verify that your steps were successful, you should see the following in Visual Studio Code:

- A new project folder was created and you can see it in the Visual Studio Code Explorer
- You can run `npm install` without errors and see the dependencies being installed in the terminal
- When running `npx rayfin --version` inside the new project, you can see a version number output in the terminal.

Next → [3. Explore the Project](../instructions/exercise-3-explore-template.md)
