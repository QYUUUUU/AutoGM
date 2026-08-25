FROM node:22-alpine

RUN apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    openssl

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=/app/app/prisma/schema.prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]