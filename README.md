# Dice Betting App

This is a dice betting application.

## Prerequisites

Make sure you have the following tools installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## How to Run the Application

Follow these steps to build and run the application.

1. **Set Up Environment Variables**

   Create a file named `.env` in the project's root directory. You can copy the content below and modify the values to your preference.

   ```
   # Environment / Scope
   NODE_ENV=development

   # PostgreSQL Variables
   POSTGRES_DB_HOST=postgres
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=mypassword
   POSTGRES_DB=dice_betting_db

   # pgAdmin Credentials
   PGADMIN_DEFAULT_EMAIL=admin@example.com
   PGADMIN_DEFAULT_PASSWORD=admin
   ```

2. **Start the Services with Docker Compose**

   From the project's root directory, run the following command. This command will build the Docker image for the application and start it in the background (`-d`).

   ```bash
   docker compose up -d
   ```

   This will start three services: the backend application, the PostgreSQL database, and the pgAdmin management tool.

3. **Access the Services**

   Once the containers are running, the services will be available at the following URLs:

   - **Backend Application**: `http://localhost:3000`
   - **pgAdmin**: `http://localhost:5050` (use the email and password you defined in the `.env` file).
   - **PostgreSQL Database**: If you need to connect to the database from your host machine (outside of Docker), you can do so using port `5434`. The port `5432` inside the Docker network is mapped to `5434` on your machine to avoid conflicts with other PostgreSQL instances you might have running.

## How to Stop the Application

To stop and remove the container, you can use the following command:

```bash
docker compose down
```
