# SDARA-IT Members Website

## Purpose

This repo is used to maintain the sourcecode for the SDARA IT website, where we look forward to store professional experiences of various SDARA IT Professionals to ease communication and exposure.
The stack used in this project consists of:
- NuxtJS 3.9
- PocketBase (Similar to Supabase)

## Development
The official backend is available via https://sdaraapi.arfsd.cyou/_/ , however this is considered the "Production" Database, where we would want to avoid manipulating it. For development purposes, please use https://staging-sdara.arfsd.cyou/_/ , where I have provided a 1:1 replica of the backend with exact same setup, but is meant to be used as a playground of sorts.

It is recommended to review the API Docs for PocketBase in the instance and the PocketBase Website. Another thing to take note is how we use the SDK in the project, where you can refer to this particular [link](https://github.com/pocketbase/js-sdk?tab=readme-ov-file#ssr-integration)
### D1 - Local Environment Setup
1. Clone the repository
2. run `npm install` in the directory (via terminal/pwsh/cmd)
3. open .env file to edit the backend endpoint. Please ensure to **NOT** use the production backend for development. *Use the staging backend if you want to keep things simple.
Else, proceed to the next section*
5. `npm run dev` to start dev server

### D2 - Local Backend Setup
If you prefer a fully local development setup, you would also need to have docker installed (we will use docker to run the backend)
1. Open the `docker` folder
2. run `docker-compose up -d` to start the backend.
3. for first setup, visit http://localhost:8547/_/ to setup the main admin account for your backend.
4. Go to Settings > Sync > Import Collections and import the collections.json file in the same directory.

## Contribution
As per normal contribution practices, you can create a new branch or a fork of the repo, and open a PR where we can collectively review and see if the changes can be merged.
Also please do respect everyone, and be a good person and always be open to constructive criticism. We are always learning more when we allow discussions.

For backend related changes/suggestions, please open an issue and attach the changes you are proposing.

## Final notes
This project is to be seen as a draft or POC, since all of these are still running under my own domain name. If we can get proper endorsement, we can slowly transition into proper infrastructure and move under the SDARA domain name.

= Berilmu untuk Berjasa =
