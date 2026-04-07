# AutoGM
Ask questions about GODS the tabletop RPG game. Also supports virtual dice throwing and an intuitive Game Master Encounter generator.

## Getting Started

### Prerequisites
You need to have Docker and Docker-compose installed on your machine. npm is used inside the container for internal package management.

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

### Environment Variables ⚠️ CRITICAL STEP
Copy the `.env` file to `.env.local` and fill in the proper API keys and secrets.
**You MUST provide a valid `OPENAI_API_KEY`**. If you do not assign a real OpenAI key, the LangChain bot will throw a fatal error when attempting to initialize the language model and embeddings.

### Database Migration & Seeding 🌱
Before using the application for the first time, you must initialize the database Schema and Seed it with the default values (like creating the Administrator user). Once the containers are running, execute the following commands:

```bash
# 1. Push the Prisma Schema models to MariaDB
docker compose exec web npx prisma db push --schema=/app/app/prisma/schema.prisma

# 2. Seed the database with the initial game state
docker compose exec web npm run prisma db seed
```

### AI Rulebook Ingestion (LangChain RAG) 📖
In order for the AI Assistant to know the game rules, it must read the core PDF and generate a Vector Store.
Ensure the file `GODS_Le_livre_de_base.pdf` is located inside `app/langChain/Documentation/`.
While logged in as a user, navigate to the ingestion URL to process the embeddings (this may take a few minutes):
**`http://localhost/backend/embedding`**

*(Note: Depending on your OpenAI account limits, creating the initial RAG embeddings might consume a few cents).*

That's it! You're now ready to start using the project. Happy coding!

### Frontend Build (Webpack)

If you modify files inside the `app/public/js/` directory that are linked to the Three.js physics engine (`dashboardDies.js`), you need to recompile the `bundle.js` file for the changes to take effect in the browser. 

To rebuild the frontend assets within the Docker container:
```bash
docker compose exec web npx webpack --config webpack.config.js
```
Make sure to hard-refresh your browser (Ctrl+F5) to load the newly compiled assets.
