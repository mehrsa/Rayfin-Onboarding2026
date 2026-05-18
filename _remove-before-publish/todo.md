# TODO
- [x] to commit: set up git account for lab / del docker desktop and VS icons
- [x] fix template?
  * [x] commit
- [x] remove skills install
- [x] no need for new folder/vscode in step 2
- [x] publish lab
- [x] src of final source code in /src + readme
- [x] lab slides
- [x] step 8 instructions test
- [x] test lab e2e + timing
- [x] powerbi -> fabric in portal
- [x] reconcile lab instructions from skillable w/ repo
- [x] update lab instructions in repo, prepare for publish
- [x] clean up TODO:
- [ ] add aka.ms docs links


Updates
- Added source code of the final lab code in /src folder
- Lab slides (heavily inspired and reusing some content from my pre-recorded session)
- 


## Done
- Draft instructions for steps 1-7 of the lab (only step 8 is missing, see below)
- Bootstrapping from local template with rayfin CLI
- Updated: Lab is 75min, including intro/conclusion. To use the additional time, I propose to create the semantic model in PowerBI desktop during the lab, instead of providing a pre-created one. This way, attendees will have the chance to see how to create a semantic model from scratch and upload it to Fabric, and avoid the issue with semantic model not matching the model updated with Copilot CLI. 
- Instructions 1-7 updated in Skillable env
- Docker installed in skillable to run rayfin app locally (issue created in the lab)
- PowerBI Pro license to create and upload the semantic model (issue created in the lab) 
- Fabric apps are available in the tenant, but not enabled in admin setting so we cannot deploy with `rayfin up`
- `npm create @microsft/rayfin@latest` is broken because of node-gyp/Python/VS dependency (1.5.0). Even with proper setup, it takes a VERY long time to install because of this change.
- No way to install the Rayfin skill in Copilot CLI, the command in docs `npx rayfin init ai-files install` doesn't work (reported in rayfin feedback channel) => waiting for new release
- resources scrape done: https://github.com/microsoft/Build26-LAB514/issues/16
- deployment was successful but required a template fix because of an issue with the `npm create @microsoft/rayfin@latest -- --template-uri` (reported in rayfin feedback channel)
- updated lab instructions to remove the local docker steps and use remote backend instead
- adding the new feature with copilot took ~5min instead of ~1.5min locally, probably because of the slow VM issue
- tested workshop up to step 7 working fine, fixed a few things along the way
- I'll commit an update to the template with an auth fix to support the remote backend
- Review instructions to create the semantic model in PowerBI desktop and upload it to Fabric (see with @Christopher Maneu) (step 8)

## /!\ Blocking

- VM and NPM install in particular is VERY slow, took more than 10min to go through template init (~1min locally), created issue: https://github.com/microsoft/Build26-LAB514/issues/24
  * using it is also painfully slow, like loading the site locally using the dev server should be instant but takes almost a minute to load the first time

## Missing

- Links to final Learn / CLI docs for Fabric apps and Rayfin tools (aka.ms)
- Look up for `TODO:` in the docs (screenshots, things to be tested, final commands, etc.)
