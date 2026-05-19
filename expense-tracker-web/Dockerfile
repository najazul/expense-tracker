FROM node:20-alpine AS build
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS final
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
EXPOSE 3000
ENTRYPOINT ["node", "dist/server/server.js"]