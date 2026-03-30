# AutoGM
Ask questions about GODS the tabletop RPG game. Also supports dice throwing and encounter generation

## Getting Started

### Prerequisites

You need to have Docker and Docker compose installed on your machine. Yarn is used inside the container for internal package management.

### Starting the Project (Docker)

This project relies on Docker to run the application via a multi-container setup. It handles startup order optimally (Node.js waits for MariaDB).
It spins up the `web` Node.js app, MariaDB database, PhpMyAdmin for db interaction, Redis, and Maildev services.

To start everything in the background, simply run:

```bash
docker compose up -d
```
*(If you encounter a permission denied error, run `sudo docker compose up -d`)*

To check the logs if something goes wrong (very useful for debugging):
```bash
docker compose logs -f
```

To shut down and stop all the services:
```bash
docker compose down
```

### Environment Variables

Copy the `.env` file to `.env.local` and fill in the proper API keys and secrets. Make sure to replace the placeholder values with the actual values.

### Database Migration

To push the database schema changes using Prisma inside the Docker container, run the following command:
```bash
docker compose exec web npx prisma db push --schema=/app/app/prisma/schema.prisma
```

That's it! You're now ready to start using the project. Happy coding!
