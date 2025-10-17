# Dice Betting App

This is a dice betting application.

## Prerequisites

Make sure you have the following tools installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## How to run the application

Follow these steps to build and run the application in a Docker container.

1. **Start the service with Docker Compose**

   From the project's root directory, run the following command. This command will build the Docker image for the application and start it in the background (`-d`).

   ```bash
   docker compose up -d
   ```

2. **Access the application**

   Once the container is running, the application will be available in your browser at the following URL: http://localhost:3000

## How to stop the application

To stop and remove the container, you can use the following command:

```bash
docker compose down
```

Este archivo `README.md` le dará a cualquier persona que use tu proyecto instrucciones claras sobre cómo ponerlo en marcha.

<!--
[PROMPT_SUGGESTION]¿Podríamos agregar una base de datos como PostgreSQL al docker-compose.yml?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Explícame qué hace el archivo Dockerfile y si se puede mejorar.[/PROMPT_SUGGESTION]
