FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json .npmrc ./

RUN npm install -g pnpm@10.33.2
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx run product:build

FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY --from=builder /app/dist/apps/product ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

CMD ["node", "main.js"]
