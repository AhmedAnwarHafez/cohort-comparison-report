This project queries Github graphql api and spits out a json file and this file is used to visualize different cohorts in a fancy visualisation.

## Setup
1. Generate a personal access token from github and select the following permissions:
```
repo
read:packages
read:org
read:public_key
read:repo_hook
user
read:discussion
read:enterprise
read:gpg_key
```

1. Paste the following commands:
```sh
git clone
npm i
cp .env.example .env
```
1. copy your personal access token in the `.env` file

1. Run the script by running `npm run start`

1. Install Power BI and open cohort-report.pbix

1. Click on **Transform Data** and on the right-hand side click on the cog icon and point to the generated `data.json`

1. Click on **Apply & Close**
