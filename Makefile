DC = docker-compose

.DEFAULT_GOAL := help

.PHONY: help init setup build up down clean logs migrate-dev test test-coverage

help: ## Muestra esta ayuda
	@grep -E '(^[a-zA-Z_-]+:.*?## .*$$)' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

init: ## Instala dependencias y aplica migraciones de desarrollo
	@echo "→ Inicializando entorno (setup + migrate)..."
	$(DC) run --rm api sh -c "npm install && npx prisma migrate dev"

setup: ## Instala dependencias del backend en el contenedor
	@echo "→ Instalando dependencias en el contenedor backend..."
	$(DC) run --rm api npm install

build: ## Construye los contenedores Docker
	@echo "→ Construyendo contenedores..."
	$(DC) build

up: ## Levanta los servicios en segundo plano
	@echo "→ Levantando servicios..."
	$(DC) up -d

down: ## Detiene los servicios
	@echo "→ Parando servicios..."
	$(DC) down

clean: ## Limpia contenedores, redes y volúmenes
	@echo "→ Limpiando todo (contenedores, redes, volúmenes)..."
	$(DC) down -v --remove-orphans

logs: ## Muestra logs de los contenedores
	@echo "→ Mostrando logs (Ctrl+C para salir)..."
	$(DC) logs -f

migrate-dev: ## Aplica migraciones Prisma dentro del contenedor
	@echo "→ Aplicando migraciones de desarrollo..."
	$(DC) run --rm api npx prisma migrate dev

test: ## Ejecuta los tests sin cobertura
	@echo "→ Corriendo tests backend..."
	$(DC) run --rm api npm run test

test-coverage: ## Ejecuta los tests con cobertura
	@echo "→ Corriendo tests backend con cobertura..."
	$(DC) run --rm api npm run test:coverage
