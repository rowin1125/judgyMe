# Setup local development environment

## Requirements
* Git (with at least a remote called `upstream`)
* [Docker](https://docs.docker.com/install/) with [Docker Compose](https://docs.docker.com/compose/install/)
* [Make](https://en.wikipedia.org/wiki/Make_(software)

## Make

The environment can be setup update `make` commands.
Run `make` to see the list of available commands.

### Initialization

Run `make init` to initialize the local development environment and install all the required application packages.

## Applications

See [applications](/docs/02-applications.md)

## Environment variables (backend)

Environment specific variables are places in `.env` files. Non secret vars are stored in the general `.env` file (like test API endpoints) and to use env vars holding secrets locally, you can use the `.env.local` file in the component root folder.

Variables which are used in the config are listed in the `.env.local.dist` file and are used as placeholders. You can copy these vars to your `.env.local` file if non existent, the actual values are usually stored in Cricket.

## Required host definitions

See [Hosts](03-hosts.md)
