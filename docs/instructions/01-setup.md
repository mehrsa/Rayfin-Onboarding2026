# Setup Your Environment

Before you can build, deploy, and explore the work-order app, you need to get your environment ready by signing in to GitHub, GitHub Copilot, and Microsoft Fabric.

For signing in via terminal, run below commands:

GitHub: 
```gh auth login```

Fabric: 
```az login```


Ensure you have below:

| Requirement | Notes |
|---|---|
| [VS Code](https://code.visualstudio.com/) | Recommended; tested environment |
| Latest Node.js|Windows: ```winget install -e --id OpenJS.NodeJS.LTS``` , macOS:  ```brew install node@lts```|
| GitHub Copilot CLI| Windows: ```winget install GitHub.Copilot``` , macOS: ```brew install copilot-cli```|
|Azure CLI|Windows: ```winget install -e --id Microsoft.AzureCLI```, macOS: ```brew install azure-cli``` |


## Clone this repo

Run below command in a terminal window (folder of your choice):

```git clone https://github.com/mehrsa/Rayfin-Onboarding2026.git```



## Test out GitHub Copilot in the terminal

1. In the virtual machine, from the taskbar, select **Windows Terminal** to open a new terminal window.

1. In the terminal, start the Copilot CLI by running: `copilot`.

1. If prompted with "Do you trust the files in this folder?", select **Yes, and remember this folder for future sessions** by navigating with the arrow keys and pressing Enter.

1. Run the following command in the Copilot CLI to start the login process: `/login`.

1. When prompted to choose a sign-in method, select **Github.com**.

1. Press any key to open the browser and sign in using the SSO session from Task 1. The device code is copied to your clipboard automatically, so paste it into the browser when asked.

1. After a successful sign-in, return to the terminal and confirm that you see "Signed in successfully" in the output.

1. *(Optional)*  If the Copilot CLI prompts you that an update is available, run: `/update` to update to the latest version.

1. Exit the Copilot CLI by running: `/exit`. You will start it again in the next exercise when you use it to generate code.

## Task 2: In the browser, Sign in to Microsoft Fabric (MSIT or DXT)

1. In a new tab on the browser, navigate to the Microsoft Fabric portal at: https://dxt.fabric.microsoft.com, or, https://msit.powerbi.com/

1. Sign in using your credentials


2. After a successful sign-in, you will land on the Microsoft Fabric homepage. **Keep this browser tab open** as you will need this active session for the next steps.

    > [!Important]
    > If the page title and icon in the bottom left corner of the page say "Power BI", you need to switch to the Fabric portal. Click on the **Power BI** icon in the bottom left corner, then select **Fabric** to switch to the Microsoft Fabric portal.

## Task 3: Create a Workspace in Fabric

You will deploy your app to a Microsoft Fabric workspace.

A workspace is a container for all the Fabric items related to your project, such as databases, notebooks, and deployed applications.

1. In the Fabric portal, select **Workspaces** from the left-hand navigation pane. Then select **+ New workspace**.

1. Name the workspace as you desire.

1. IMPORTANT: Expand the **Advanced** section and scroll to the **Workspace type** setting and ensure that **Fabric Trial** is selected.

1. Select **Apply** to create the workspace.

---

## Verify Your Setup

Navigate back to the Windows Terminal and run the following commands to verify that your environment is set up correctly:

```shell
node --version
npm --version
copilot --version
```


