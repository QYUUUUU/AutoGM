# AutoGM
Ask questions about GODS the tabletop RPG game. Also supports dice throwing and encounter generation

## Getting Started

### Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

### Docker Compose

To start the project using Docker Compose, run the following command:

```bash
dc up -d
```

### Environment Variables

Copy the `.env` file to `.env.local` and fill in the proper API keys and secrets. Make sure to replace the placeholder values with the actual values.

### Database Migration

To push the database changes using Prisma, run the following command:

```bash
npx prisma db push
```

That's it! You're now ready to start using the project. Happy coding!
