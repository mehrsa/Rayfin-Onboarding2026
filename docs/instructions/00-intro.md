@lab.Title

# Get Started

> [!TIP]
> As you follow the instructions in this pane, whenever you see a +++icon+++, you can use it to copy text from the instruction pane into the virtual machine interface.

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
