FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_BASE

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE=$VITE_API_BASE

RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "preview"]
