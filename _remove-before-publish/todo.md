# TODO

Things done, blocking and missing at this point:

## Done
- Draft instructions for steps 1-7 of the lab (only step 8 is missing, see below)
- Bootstrapping from local template with rayfin CLI
- Updated: Lab is 75min, including intro/conclusion. To use the additional time, I propose to create the semantic model in PowerBI desktop during the lab, instead of providing a pre-created one. This way, attendees will have the chance to see how to create a semantic model from scratch and upload it to Fabric, and avoid the issue with semantic model not matching the model updated with Copilot CLI. 

## /!\ Blocking

- Fabric apps still not available in the tenant, we cannot deploy with `rayfin up`
- No way to install the Rayfin skill in Copilot CLI, the command in docs `npx rayfin init ai-files install` doesn't work (reported in rayfin feedback channel)
- Docker installed in skillable to run rayfin app locally (issue created in the lab)
- PowerBI Pro license to create and upload the semantic model (issue created in the lab) 

## Missing

- Links to final Learn / CLI docs for Fabric apps and Rayfin tools (aka.ms)
- Look up for `TODO:` in the docs (screenshots, things to be tested, final commands, etc.)
- Instructions to create the semantic model in PowerBI desktop and upload it to Fabric (see with @Christopher Maneu) (step 8)
- Lab slides
