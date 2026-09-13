FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY .env.example ./.env.example

ENV REQUEST_TIMEOUT_MS=5000 \
    REPORTS_DIR=reports

VOLUME ["/app/reports"]

ENTRYPOINT ["node", "src/index.js"]