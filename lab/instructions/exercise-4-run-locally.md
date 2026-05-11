# Exercise 4: Run the Rayfin App Locally

Since you have explored the project, let's move on to running the Rayfin app locally. You will start the **Rayfin backend (database, auth, data API)** locally, then the **frontend dev server**, and finally walk through the app's two views as a Service Pro and as a manager. This is a crucial step to verify that everything is working correctly before we deploy to Microsoft Fabric in the next exercise.

> [!Tip]
> The local backend is a full Rayfin environment running in Docker on your machine — same shape as production, just running locally.

## Task 1: Start the Rayfin backend

1. In the terminal in Visual Studio Code, make sure you are in the `field-services-app` folder that was generated in Exercise 2. If not, navigate to it using the following command:

    ```shell
    cd field-services-app
    ```

1. Start the Rayfin backend by running the following command:

    ```shell
    npx rayfin dev
    ```

1. When you run this command, it will do the following:

    - Start Docker containers for every service enabled in `rayfin/rayfin.yml` (database, auth, data API).
    - Run health checks until everything is ready.
    - **Auto-apply your data model** to the local database (you don't need a separate `db apply` on first run).

1. Leave this terminal running as the backend needs to stay up while you run the frontend and test the app. You'll see logs streaming in the terminal — when it's ready, the CLI prints the URLs for the local backend and the **publishable key** the frontend uses to connect.

> [!help]
> If `rayfin dev` complains about Docker, make sure Docker Desktop is running.

> [!TIP]
> The rayfin backend will keep running in the background, even if you close the terminal or Visual Studio Code. To stop it, run `npx rayfin dev stop` from your project folder.

### Task 1.1 Optional: Enable the Aspire Dashboard

1. If you want to see live telemetry from your app in the Aspire dashboard like request logs, traces, and service health; stop the backend with the following command:

    ```shell
    npx rayfin dev stop
    ```

1. Restart the backend with the `--debug` flag:

    ```shell
    npx rayfin dev --debug
    ```

1. The CLI will print an **Aspire dashboard** URL alongside the backend URLs. Open it in your browser to inspect what the backend is doing as you click around the app. You'll be able to see log traces here, which is super helpful for debugging and understanding how the different services interact.

## Task 2: Open the Data API explorer

1. Once `rayfin dev` is up and running, open the URL that was printed by the CLI for local backend in your browser. It should look something like this: `http://localhost:5168`.

1. This will land you on the **OpenAPI / Swagger UI** for your data API, which was automatically generated from the entities in **rayfin/data/**.

1. Expand the **ServicePro** or **WorkOrder** endpoints. Each entity has auto-generated CRUD operations with validation and authorization rules from your decorator applied.

## Task 3: Start the frontend dev server

1. Open a terminal in Visual Studio Code (you can open a new one since the backend is running in the other terminal) and make sure you are in the `field-services-app` folder.

1. Start the frontend dev server with the following command:

    ```shell
    npm run dev
    ```

1. This will start the Vite dev server and open the app in your default browser at `http://localhost:5173`. Select and open the link in the browser of the VM.

## Task 4: Sign in as a Service Pro and explore the app

Locally, Rayfin uses **email + password** auth (in production, the same app uses Microsoft Entra SSO, no code change required).

1.  On the auth page, switch to **Sign up** and create an account with any email + password.

1. After sign-in, you land on the **Service Pro view**. Fill in your name and a few skills (for example `painting, hanging, drilling`) and create your profile.

1. You'll see one pre-seeded work order ready to be assigned. **Accept it** and then **mark it complete**.

1. You can edit your profile later if needed in the profile view.

## Task 5: Sign in as a manager and explore the app

The app also has a manager view at **/manager/**. It's not linked from the Service Pro UI on purpose.

1. In the browser, navigate to `http://localhost:5173/manager/` or add `/manager/` to the URL.

1. The manager view allows you to:
    - Create new work orders (customer, address, task, scheduled date)
    - Assign them to a Service Pro
    - Track status across all jobs

1. Create a couple of new work orders and assign them to your Service Pro account.

1. Select **Jobs** in the nav bar to switch bar to the service pro view and confirm they show up.

---

## Verify that everything is working correctly

- The terminal running `rayfin dev` shows all services healthy. You can use `npx rayfin dev status` to check the status of each service at any time.
- The Swagger UI for your local backend opens in the browser.
- `http://localhost:5173` shows the auth page.
- You can sign up, create a Service Pro profile, accept the seeded work order, and create new ones from **/manager/**.

When you're ready to take the app to production, leave the local servers running and head to the next step.

Next → [5. Deploy to Microsoft Fabric](../instructions/exercise-5-deploy-to-production.md)
