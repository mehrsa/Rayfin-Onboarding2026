# Exercise 4: Run the App Locally

In this exercise, you will run the Field Services app locally.

You will:

- **Provision a Fabric backend** for the app with one command
- Start the **frontend dev server** locally
Then you will sign in, create a Service Pro profile, complete a work order, and test the manager view.

## Task 1: Provision the Fabric backend

The `rayfin up` command provisions a managed backend (database, auth, data API) in your Fabric workspace and wires your local frontend to talk to it.

1. Using the Visual Studio Code terminal from the previous exercise, provision the Fabric backend by running:

    ```shell
    npx rayfin up
    ```

1. As this is your first time deploying, the CLI will:

    - Open a browser to sign you in to Microsoft Entra. Authentication will be automatic since you already have an active SSO session from Exercise 1.
    - **Create a Fabric App item** in the workspace you wired up at bootstrap.
    - **Provision a managed SQL database** for your data model.
    - **Apply your schema** to that database.
    - **Generate a publishable key** for the new backend.
    - **Wire your frontend** to the new backend by writing the connection details and key into `.env.local` and `rayfin/.env`.

1. Watch the terminal for progress on each step. The first run takes a couple of minutes.

1. When the command finishes, the CLI prints the deployment details, including the backend URL.

> [!Tip]
> The CLI saves the deployment details to `rayfin/.deployments.json` so subsequent `rayfin up` runs update the same deployment instead of creating a new one.

## Task 2: Start the frontend

The frontend is the React app that users interact with.

1. In the same terminal, start the Vite dev server:

    ```shell
    npm run dev
    ```

    Because `rayfin up` already wrote the backend URL and publishable key into `.env.local`, Vite picks them up automatically. Your locally-served frontend talks to the freshly provisioned Fabric backend with no extra configuration.

1. Copy the local frontend URL shown in the terminal, which should look similar to `http://localhost:5173`, and open it in a new browser tab.

1. Confirm that the app sign-in page opens.

## Task 3: Sign up as a Service Pro

The authentication page includes a **"Sign in with Microsoft"** button, and the backend uses Microsoft Entra (Fabric SSO) for sign-in.

1. Select the **Sign in with Microsoft** button. Since you already have an active SSO session from Exercise 1, you should be signed in automatically without needing to enter credentials again.

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

---

Next → [5. Deploy to Microsoft Fabric](../instructions/exercise-5-deploy-to-production.md)
