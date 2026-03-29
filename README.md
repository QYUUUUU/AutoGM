# AutoGM
Ask questions about GODS the tabletop RPG game. Also supports dice throwing and encounter generation

## Getting Started

### Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

### Starting the Project (Docker)

This project relies on Docker to run the application via a multi-container setup. It spins up the `web` Node.js app, MariaDB database, PhpMyAdmin for db interaction, Redis, and Maildev services.

To start everything in the background, simply run:

```bash
docker compose up -d
```
*(If you encounter a permission denied error, run `sudo docker compose up -d`)*

To check the logs if something goes wrong:
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

To push the database schema changes using Prisma, run the following command (make sure the `mariadb` container is running first):

```bash
npx prisma db push
```

That's it! You're now ready to start using the project. Happy coding!
