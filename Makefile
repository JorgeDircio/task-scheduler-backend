DC = docker-compose
PRISMA = npx prisma
NPM = npm

.DEFAULT_GOAL := help

.PHONY: help init setup setup-backend build up down clean logs migrate-dev test test-coverage

help: ## Muestra esta ayuda
	@grep -E '(^[a-zA-Z_-]+:.*?## .*$$)' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

init: setup migrate-dev ## Instala dependencias y aplica migraciones de desarrollo

setup: setup-backend ## Ejecuta setup del backend

setup-backend: ## Instala dependencias del backend
	@echo "→ Instalando dependencias en el backend..."
	$(NPM) install

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

migrate-dev: ## Aplica migraciones de desarrollo con Prisma
	@echo "→ Aplicando migraciones de desarrollo..."
	$(PRISMA) migrate dev

test: ## Ejecuta los tests sin cobertura
	@echo "→ Corriendo tests backend..."
	$(NPM) test

test-coverage: ## Ejecuta los tests con cobertura
	@echo "→ Corriendo tests backend con cobertura..."
	$(NPM) run test:coverage
