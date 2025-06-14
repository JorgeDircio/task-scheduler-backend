# Task Scheduler Backend

Este repositorio contiene el **backend** de la aplicación Task Scheduler, implementado en **Node.js** y **Express**, con **RabbitMQ** para mensajería, **Prisma** y **PostgreSQL** para persistencia, y **Jest** para pruebas unitarias de la lógica de scheduling (SJF + prioridad).

---

## 🛠️ Tecnologías y Stack

* **Node.js** (v16+)
* **TypeScript**
* **Express** como framework HTTP
* **RabbitMQ** para cola de mensajes (crear/listar/schedule/getById/delete)
* **Prisma** como ORM para PostgreSQL
* **PostgreSQL** como base de datos relacional
* **Jest** + **ts-jest** para pruebas unitarias
* **Docker Compose** para orquestación de contenedores
* **Makefile** para comandos de desarrollo y despliegue

---

## ⚙️ Prerrequisitos

* **Linux** o **macOS** (para `make`).
  En Windows (sin WSL) usar los comandos manuales descritos más abajo.
* **Docker** y **Docker Compose** instalados.
* **Node.js** y **npm** (para desarrollo local sin contenedores).

---

## 🚀 Instalación y ejecución

### Con Makefile (Linux/macOS)

```bash
# 1. Clonar el repositorio y entrar a la carpeta
git clone https://github.com/JorgeDircio/task-scheduler-backend
cd task-scheduler-backend

# 2. Construir las imágenes Docker
make build

# 3. Levantar los servicios (API, RabbitMQ, PostgreSQL)
make up

# 4. Instalar dependencias y aplicar migraciones
make init

Una vez terminado hasta este punto, ya tienes el backend corriendo, los demas pasos son opcionales.

# 5. Ver logs
make logs

# 6. Parar servicios
make down

# 7. Limpiar contenedores/volúmenes
make clean

# 8. Ejecutar pruebas unitarias
make test

# 9. Ejecutar pruebas con cobertura
make test-coverage
```

### Sin Makefile (Windows / manual)

```bash
# 1. Clonar el repositorio y entrar a la carpeta
git clone https://github.com/JorgeDircio/task-scheduler-backend
cd task-scheduler-backend


# 2. Levantar servicios con Docker Compose
docker-compose up -d --build

# 3. Aplicar migraciones de desarrollo (requiere Postgres corriendo)
docker-compose run --rm api npx prisma migrate dev

Una vez terminado hasta este punto, ya tienes el backend corriendo, los demas pasos son opcionales.

# 4. Ver logs
docker-compose logs -f

# 5. Parar servicios
docker-compose down

# 6. Limpiar contenedores/volúmenes
docker-compose down -v --remove-orphans

# 7. Ejecutar pruebas unitarias
docker-compose run --rm api npm run test

# 8. Ejecutar pruebas con cobertura
docker-compose run --rm api npm run test:coverage
```

---

## 📐 Arquitectura

![Arquitectura](https://i.postimg.cc/FzhL7mfz/Diagrama-Arquitectura-backend-tasks.png)



---

## 📂 Estructura de carpetas

```bash
task-scheduler-backend/
├─ coverage/
├─ node_modules/
├─ prisma/
│  ├─ migrations/
│  └─ schema.prisma
├─ src/
│  ├─ __test__/
│  │  └─ tasks/
│  │     └─ scheduler.service.spec.ts
│  ├─ common/
│  │  └─ helpers/amqp.helper.ts
│  ├─ config/
│  │  └─ index.ts  # swaggerConfig
│  ├─ controllers/
│  │  └─ task.controller.ts
│  ├─ db.ts
│  ├─ models/
│  │  └─ task.model.ts
│  ├─ routes/
│  │  └─ task.routes.ts
│  ├─ services/
│  │  └─ scheduler.service.ts
│  ├─ server.ts
│  └─ worker.ts
├─ .env
├─ .gitignore
├─ Dockerfile
├─ docker-compose.yml
├─ jest.config.js
├─ Makefile
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 🔍 Pruebas

Este proyecto incluye pruebas unitarias (**Jest**) para la función `calculateSJFWithPriority`. Para ejecutarlas:

```bash
npm run test
```

Y ver cobertura:

```bash
npm run test:coverage
```

---

## 📖 Documentación API

Accede a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

---