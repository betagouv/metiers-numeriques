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
- [IDEs](#ides)
  - [Recommended Visual Studio Code settings](#recommended-visual-studio-code-settings)

## Get Started

### Requirements

- [Node.js](https://nodejs.org) v18 (with npm v8)
- [Yarn](https://yarnpkg.com/getting-started/install) v1.22
- [Docker](https://www.docker.com/get-started) >= v20

### First Setup

> ⚠️ **Important**  
> If you're under **Windows**, please run all the CLI commands within a Linux shell-like terminal (i.e.: Git Bash).

Then run:

```sh
git clone https://github.com/betagouv/metiers-numeriques.git
cd metiers-numeriques
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
app/                # Application code base
common/             # Code base common to both API and Application
config/             # Various configuration and setup files
e2e/                # Playwright end-to-end tests
graphql/            # GraphQL schemas
pages/              # Path-based entrypoint files (natively handled by Next.js)
prisma/             # Prisma ORM schema, migrations and seeds
public/             # Public assets (natively handled by Next.js)
scripts/            # Scripts code base
```

### Stack

It's a full Typescript application (for both backend & frontend code).

- The WebApp & API are under [Next.js](https://nextjs.org) framework.
- The database is a PostgreSQL one managed through [Prisma](https://www.prisma.io) ORM (including migrations & seeds).

## Deployment

This website should be ready to be deployed on Scalingo as is. Request an access in Mattermost if you need one.

## Common Tasks

### Generate a new database migration

Each time you add a final change in `./prisma/schema.prisma`, you need to generate a migration as well as updating
Prisma typings in order to record it:

```sh
yarn dev:migrate
```

You then need to name your new migration. Please check previous generated migrations to keep some naming consistency.

And don't forget to restart your local instance in order for Prisma to load the new schema.

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
