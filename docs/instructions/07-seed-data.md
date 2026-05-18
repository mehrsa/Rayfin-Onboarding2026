# Exercise 7: Seed Data for Analysis

In Exercise 6, you implemented and deployed a schema-backed comments feature. In this exercise, you will seed the backend with a richer dataset for the analysis-focused steps that follow.

Seeding data provides a realistic set of service pros, work orders, and statuses so the next analysis-focused exercises have meaningful data to query.

By completing this exercise, you will:

- Use the built-in admin experience to seed the database.
- Confirm that the app now includes a larger, more realistic dataset.
- Optionally add additional comments to improve downstream analysis scenarios.

## Task 1: Open the admin page and seed the database

The template includes an authenticated admin page at `/_admin/` that can generate a larger dataset from `src/data/field-service-seed.json`.

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