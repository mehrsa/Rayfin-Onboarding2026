# Specification for Field Services App

This is the initial prompt that we using to create the Field Services App template, using the built-in Copilot CLI template of `npm create @microsoft/rayfin@latest` command.

## Initial prompt

Contoso DIY is expanding its scope: after you chose the perfect painting for your living room, could get a service pro to do the work for you?

To prepare the day for the field work, we need an app to manage the work orders and assign the right service pro to the right job. Create a Fabric app using Rayfin tools for that.

App have 2 profiles:
- service pro: can see the work orders, accept them, and mark them as done
  * on first access, you need to create a service pro profile with your name and skills (e.g. painting, plumbing, etc.)
- manager: can create work orders, assign them to service pro, and track the progress. only accessible with a specific URL

You can find example data in `data/work-orders.jsonc`, use it to model the data schema and to bootstrap the app.
