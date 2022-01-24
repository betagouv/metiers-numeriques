# Contributing

- [Get Started](#get-started)
  - [Requirements](#requirements)
  - [First Setup](#first-setup)
  - [Local development](#local-development)
  - [Main directories](#main-directories)
  - [Stack](#stack)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)
  - [Generate a new database migration](#generate-a-new-database-migration)
  - [Validate the HTML](#validate-the-html)
  - [Update the Design System](#update-the-design-system)
- [IDEs](#ides)
  - [Recommended Visual Studio Code settings](#recommended-visual-studio-code-settings)

## Get Started

### Requirements

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://www.docker.com/get-started)

### First Setup

> ⚠️ **Important**  
> If you're under **Windows**, please run all the CLI commands within a Linux shell-like terminal (i.e.: Git Bash).

Then run:

```sh
git clone https://github.com/betagouv/tell-me.git
cd tell-me
yarn
yarn setup
yarn dev:docker
yarn db:migrate
npx nexauth init
```

> 📋 **Note**  
> The `yarn` command install the dependencies but also run the `scripts/dev/setup.js` scripts. This script does the
> following tasks, if necessary:
>
> - Copy `.env.example` file to a `.env` one.
> - Generate a RSA Key Pair (required in order to generate and verify [JWTs](https://jwt.io))

### Local development

```sh
yarn dev:docker
yarn dev
```

This will run MongoDB within a Docker container via Docker Compose and run the webapp which should then be available at
[http://localhost:3000](http://localhost:3000).

It will also watch for file changes and automatically re-hydrate the webapp on the go.

### Main directories

```sh
api/                # API code base
app/                # WebApp code base
common/             # Source files that are common to all parts (API & Application)
pages/              # URL path entrypoint file (natively handled by Next.js)
public/             # Public assets (natively handled by Next.js)
scripts/            # CI and enviroment-related scripts
```

### Stack

It's a full Typescript application (for both backend & frontend code).

- The WebApp & API are under [Next.js](https://nextjs.org) framework.
- The database is a PostgreSQL one managed through [Prisma](https://www.prisma.io) ORM (including migrations & seeds).

## Deployment

This website should be ready to be deployed on Scalingo as is. Request an access in Mattermost if you need one.

## Common Tasks

### Generate a new database migration

Each time you add a final change in `./prisma/schema.prisma`, you need to generate a migration in order to record it:

```sh
yarn db:migrate
```

You then need to name your new migration. Please check the previous generated migrations to keep the naming consistent.

### Validate the HTML

```sh
yarn checkHTML -- <page_url>
```

### Update the Design System

Update @gouvfr/dsfr version in `package.json` and run:

```sh
yarn
```

## IDEs

### Recommended Visual Studio Code settings

`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "typescript.tsdk": ".yarn/sdks/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```
