# Exercise 5: Deploy to Production on Microsoft Fabric

You've seen the app run locally. In this exercise, let's take the **same code, same schema, same auth wiring** and ship it to Microsoft Fabric — no infrastructure to provision, no migrations to write, no deployment pipeline to set up. One command.

> [!NOTE]
> The Fabric workspace and capacity you set up earlier is the deployment target. The bootstrap command you used already wired your project to that workspace via `--workspace-uri`.

## Task 1: Run the Rayfin App

1. In the terminal in Visual Studio Code, make sure you are in the `field-services-app` folder that was generated in Exercise 2. If not, navigate to it using the following command:

    ```shell
    cd field-services-app
    ```
1. Deploy the app to Microsoft Fabric by running the following command:

    ```shell
    npx rayfin up
    ```

1. If this is your first time deploying from this Virtual Machine, the CLI will do the following:

    - **Open a browser** to sign you in to Microsoft Entra (use the same account you used before if asked).
    - **Create a Fabric App item** in your Fabric workspace.
    - **Retrieve the publishable key** for the deployed backend.
    - **Sync `rayfin.yml`** settings to the remote service (auth, data, static hosting flags).
    - **Apply your data model** to the remote SQL database — same TypeScript decorators, same schema you used locally.
    - **Build and deploy your frontend** — runs `npm run build:fabric`, packages `dist/` into a ZIP, uploads it, and serves it from the managed static-hosting service.
    - **Save deployment details** to `rayfin/.deployments.json` and `rayfin/.env` so future `rayfin up` runs update the same deployment instead of creating a new one.
 
1. This deployment process takes a couple of minutes the time. The CLI will stream progress for each step in the terminal so you can see what's happening.

1. Once the process is complete, the CLI will print the following:

    - A **hosting URL** — your live app.
    - A **Fabric portal link** — to manage the deployment in the Fabric UI.
    - A **deployment ID** — for reference.

## Task 2: Open the deployed app

1. Copy the hosting URL from from what the CLI printed and open it in your browser.

1. The auth page should look different from the local version, you will see a **"Sign in with Microsoft Fabric"** button instead of the **email + password** fields. This is because because deployed Rayfin apps **only support Fabric brokered authentication (Microsoft Entra SSO)**. Email/password is local-dev only. The same **rayfin.yml** had both providers enabled: Rayfin's auth layer auto-selects the right one based on where the app runs.

1. Select the **"Sign in with Microsoft Fabric"** button. You will be prompted to sign in with Microsoft Entra. Use these credentials:

    - **Email**: `@lab.CloudPortalCredential(User1).Username`
    - **TAP**: `@lab.CloudPortalCredential(User1).AccessToken`

1. You're back in the Service Pro view. Create your profile, accept the seeded work order, same flow as local.

1. Navigate to `/manager/` and and create a couple of new work orders.

1. You are now using the **production database** running in your Fabric workspace.

## Task 3 Optional: Check the deployment

1. To inspect deployment health later:

    ```shell
    npx rayfin up status
    ```

1. Select the **Fabric portal link** that is printed by the `rayfin up` command or open the **Lab514-workorders-@lab.LabInstance.Id** workspace you created in the Fabric portal.

---

## ✅ Verify

- `rayfin up` completed with no errors and printed a hosting URL.
- The hosting URL opens your app and shows the **"Sign in with Microsoft Fabric"** button.
- After signing in, you can create a Service Pro profile and work orders against the deployed backend.

Next → [6. To Add a new Feature to the app](../instructions/exercise-6-new-feature.md)
