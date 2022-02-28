.PHONY: all

# ===========================
# Default: help section
# ===========================

info: intro commands

intro:
	@echo "     __        __          __  ___   "
	@echo " __ / /_ _____/ /__ ___ __/  |/  /__ "
	@echo "/ // / // / _  / _ \`/ // / /|_/ / -_)"
	@echo "\___/\_,_/\_,_/\_, /\_, /_/  /_/\__/ "
	@echo "              /___//___/             "
	@echo "                                     "

# ===========================
# Main commands
# ===========================

init: intro \
		do-check-hosts-file \
		do-copy-env-files \
		do-build-containers \
		do-start-containers \
		do-start-proxy \
		do-connect-proxy \
		do-updates \
		do-db-push \
		do-show-applications
		#  do-seed-database \

# Docker containers
build: intro do-build-containers do-start-containers
start: intro \
	do-check-hosts-file \
	do-start-proxy \
	do-start-containers \
	do-connect-proxy \
	do-show-applications

stop: intro do-disconnect-proxy do-stop-containers
down: intro do-disconnect-proxy do-bring-containers-down
restart: intro do-stop-containers do-start-containers


# ===========================
# Snippets
# ===========================

set-ids = USERID=$$(id -u) GROUPID=$$(id -g)
docker-compose-run = docker-compose run --rm -u $$(id -u):$$(id -g)
docker-compose-exec = docker-compose exec -u $$(id -u):$$(id -g)
docker-compose-up = ${set-ids} docker-compose up -d --remove-orphans
docker-run-azure-cli = docker run --rm --volume `pwd`/dev/azurite-fixtures:/fixtures --network crv-webshop mcr.microsoft.com/azure-cli az
docker-run-alpine = docker run --rm -u $$(id -u):$$(id -g) -v `pwd`:/app -w /app alpine:3.13

# ===========================
# Common recipes
# ===========================

commands:
	@echo "\n=== Makefile commands ===\n"
	@echo "Project commands:"
	@echo "    make init                          Initialise and run the project for development."
	@echo "    make update                        Update the project to run with the latest updates/builds."
	@echo "\nDocker containers:"
	@echo "    make build                         Build and start the project containers."
	@echo "    make start                         Start the project containers."
	@echo "    make stop                          Stop the project containers."
	@echo "    make down                          Stop the project containers and clean the docker-compose environment."
	@echo "    make restart                       Restart the project containers."
	@echo "    make web-shell                 		Open web shell in container."
	@echo "    make backend-shell         				Open web backend shell in container."
	@echo "\nTests:"
	@echo "    make test                          Run all test suits."
	@echo "    make int-tests                    	Run the intergration tests with jest."
	@echo "    make unit-tests                    Run the unit tests with jest."
	@echo "    make code-checks                   Run all code checks."
	@echo "    make code-fix                      Autofix codestyle issues."
	@echo "\nDatabase:"
	@echo "    make do-db-seed                    Seed the database with dummy data."
	@echo "    make do-db-reset                   Reset / flush the database."
	@echo "\nHost proxy"
	@echo "    make stop-hosts-proxy              Stop the hosts proxy (for all projects!)."

# ===========================
# Container commands
# ===========================

do-start-containers: \
	do-start-docker-containers \
	do-prisma-studio

do-start-docker-containers:
	@echo "\n=== Starting project containers ===\n"
	@${docker-compose-up}
	@echo "\nContainers are running!"

do-show-applications:
	@echo "\n=== Everything is ready! === \n"
	@cat docs/02-applications.md
	@echo ""

do-stop-containers:
	@echo "\n=== Stopping project containers ===\n"
	@docker-compose stop

do-bring-containers-down:
	@echo "\n=== Stopping project containers and cleaning docker-compose environment ===\n"
	@docker-compose down

do-build-containers:
	@echo "\n=== Building project containers ===\n"
	@${set-ids} docker-compose build

# ===========================
# Open shell in container
# ===========================

do-web-shell:
	@echo "\n=== Open shell in web container ===\n"
	@${docker-compose-exec} web sh

do-backend-shell:
	@echo "\n=== Open shell in backend container ===\n"
	@${docker-compose-exec} backend sh

do-database-shell:
	@echo "\n=== Open shell in database container ===\n"
	@${docker-compose-exec} database sh

do-database-test-shell:
	@echo "\n=== Open shell in database-test container ===\n"
	@${docker-compose-exec} database-test sh

# ===========================
# Update commands
# ===========================

do-updates: \
	do-web-updates \
	do-backend-updates

do-web-updates:
	@echo "\n=== Web: Running npm installation ===\n"
	@${docker-compose-run} web npm install

do-backend-updates:
	@echo "\n=== Backend: Running npm installation ===\n"
	@${docker-compose-run} backend npm install

# ===========================
# Database commands
# ===========================

do-migrate:
	@echo "\n=== Database: Creating and running a migration ===\n"
	@read -p "Enter the name of the migration?: " name; \
	${docker-compose-run} backend npx prisma migrate dev -n $$name

do-migrate-create-only:
	@echo "\n=== Database: Create a migration with '--create-only' ===\n"
	@read -p "Enter the name of the migration?: " name; \
	${docker-compose-run} backend npx prisma migrate dev --create-only -n $$name

do-db-push:
	@echo "\n=== Database: Pushing migrations to the db ===\n"
	${docker-compose-run} backend npx prisma db push

do-db-seed:
	@echo "\n=== Database: Seeding the datbase ===\n"
	@${docker-compose-run} backend npx prisma db seed

do-db-reset:
	@echo "\n=== Database: Resetting the database ===\n"
	@${docker-compose-run} backend npx prisma migrate reset

do-prisma-studio:
	@echo "\n=== Database: Running Prisma studio ===\n"
	@${docker-compose-exec} -d backend npx prisma studio

# ===========================
# Copy env files
# ===========================

do-copy-env-files: do-backend-copy-env-file do-web-copy-env-file

do-backend-copy-env-file:
	@echo "\n=== backend: Create .env file if not exists ===\n"
	@${docker-run-alpine} sh -c \
		"if [ ! -f components/backend/.env ]; \
		then \
			cp components/backend/.env.dist components/backend/.env \
			&& echo '✔ .env has been created'; \
		fi"

do-web-copy-env-file:
	@echo "\n=== Web: Create .env.local file if not exists ===\n"
	@${docker-run-alpine} sh -c \
		"if [ ! -f components/web/.env.local ]; \
		then \
			cp components/web/.env.local.dist components/web/.env.local \
			&& echo '✔ .env.local has been created'; \
		fi"

# ===========================
# Hosts proxy
# ===========================

do-start-proxy:
	@echo "\n=== Start hosts proxy ===\n"
	@curl --silent https://gitlab.enrise.com/Enrise/DevProxy/-/raw/master/start.sh | sh

do-connect-proxy:
	@echo "\n=== Connect to hosts proxy ===\n"
	@docker network connect judgyme enrise-dev-proxy && echo "Connected." || true

do-stop-proxy:
	@echo "\n=== Stop hosts proxy ===\n"
	@docker container stop enrise-dev-proxy && echo "Stopped." || true

do-disconnect-proxy:
	@echo "\n=== Disconnect from hosts proxy ===\n"
	@docker network disconnect judgyme enrise-dev-proxy && echo "Disconnected." || true

do-check-hosts-file:
	@cat /etc/hosts | grep judgyme-dev > /dev/null \
	|| (echo "\n=== HOSTS MISSING ===\n\n\
	You are missing some hosts in your /etc/hosts file:" \
	&& cat docs/03-hosts.md \
	&& false)

# ===========================
# Tests
# ===========================

do-be-int-tests:
	@echo "\n=== Backend: Resetting test-db for int-tests ===\n"
	docker-compose rm -s -v database-test --force && make do-start-docker-containers && sleep 5
	@echo "\n=== Backend: Run intergration tests ===\n"
	@${docker-compose-run} backend-test npm run test:int
