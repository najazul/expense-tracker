FROM node:20-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

FROM node:20-alpine AS final
WORKDIR /app

COPY --from=build /app/.output ./.output
EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]